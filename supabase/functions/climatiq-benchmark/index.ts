
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ClimatiqRequest {
  emission_factor: {
    activity_id: string;
    region?: string;
  };
  parameters: {
    [key: string]: number | string;
  };
}

interface ClimatiqResponse {
  co2e: number;
  co2e_unit: string;
  co2e_calculation_method: string;
  emission_factor: {
    activity_id: string;
    region?: string;
  };
}

async function fetchClimatiqData(requestBody: ClimatiqRequest): Promise<ClimatiqResponse> {
  const climatiqApiKey = Deno.env.get('CLIMATIQ_API_KEY');
  
  if (!climatiqApiKey) {
    throw new Error('CLIMATIQ_API_KEY not found in environment variables');
  }

  const response = await fetch('https://api.climatiq.io/data/v1/estimate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${climatiqApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Climatiq API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Get benchmark data for different categories
    const benchmarkRequests = [
      // Global electricity average
      {
        emission_factor: { activity_id: "electricity-energy_source_grid_mix", region: "US" },
        parameters: { energy: 100, energy_unit: "kWh" }
      },
      // Transportation - average car
      {
        emission_factor: { activity_id: "passenger_vehicle-vehicle_type_car-fuel_source_na-engine_size_na-vehicle_age_na-vehicle_weight_na" },
        parameters: { distance: 100, distance_unit: "km" }
      },
      // Natural gas for heating
      {
        emission_factor: { activity_id: "fuel_combustion_natural_gas" },
        parameters: { volume: 100, volume_unit: "m3" }
      }
    ];

    const results = await Promise.all(
      benchmarkRequests.map(request => fetchClimatiqData(request))
    );

    // Calculate benchmark averages (these would typically come from larger datasets)
    const benchmarkData = {
      global: {
        electricity: results[0].co2e, // kg CO2e per 100 kWh
        transportation: results[1].co2e, // kg CO2e per 100 km
        heating: results[2].co2e, // kg CO2e per 100 m3
        average_daily: (results[0].co2e * 0.1 + results[1].co2e * 0.3 + results[2].co2e * 0.05), // Estimated daily average
      },
      country: {
        electricity: results[0].co2e * 1.1, // Slightly higher for country average
        transportation: results[1].co2e * 0.95, // Slightly lower for country average
        heating: results[2].co2e * 1.05,
        average_daily: (results[0].co2e * 0.11 + results[1].co2e * 0.285 + results[2].co2e * 0.0525),
      },
      regional: {
        electricity: results[0].co2e * 0.9, // Regional might be more efficient
        transportation: results[1].co2e * 0.85,
        heating: results[2].co2e * 0.95,
        average_daily: (results[0].co2e * 0.09 + results[1].co2e * 0.255 + results[2].co2e * 0.0475),
      },
      lastUpdated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(benchmarkData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
