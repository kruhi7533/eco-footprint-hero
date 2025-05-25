-- Create a view for daily carbon emission summaries
create or replace view daily_summaries as
select 
    user_id,
    entry_date,
    sum(transport_emissions) as total_transport_emissions,
    sum(energy_emissions) as total_energy_emissions,
    sum(diet_emissions) as total_diet_emissions,
    sum(waste_emissions) as total_waste_emissions,
    sum(transport_emissions + energy_emissions + diet_emissions + waste_emissions) as total_emissions,
    count(*) as entry_count
from carbon_entries
group by user_id, entry_date;

-- Create a function to get user's progress
create or replace function get_user_progress(user_uuid uuid)
returns table (
    category text,
    current_emissions float,
    baseline_emissions float,
    reduction float,
    percentage float
) as $$
declare
    baseline_record record;
    current_record record;
begin
    -- Get the user's baseline
    select * from user_baselines 
    where user_id = user_uuid 
    order by created_at asc 
    limit 1 
    into baseline_record;

    -- Get the user's current emissions (average of last 7 days)
    select 
        avg(total_transport_emissions) as transport_avg,
        avg(total_energy_emissions) as energy_avg,
        avg(total_diet_emissions) as diet_avg,
        avg(total_waste_emissions) as waste_avg
    from daily_summaries
    where user_id = user_uuid
    and entry_date >= current_date - interval '7 days'
    into current_record;

    -- Return progress for each category
    return query
    select 'transportation'::text as category,
           coalesce(current_record.transport_avg, 0) as current_emissions,
           coalesce(baseline_record.transportation_emissions, 0) as baseline_emissions,
           greatest(0, coalesce(baseline_record.transportation_emissions, 0) - coalesce(current_record.transport_avg, 0)) as reduction,
           case 
               when coalesce(baseline_record.transportation_emissions, 0) > 0 
               then greatest(0, (1 - coalesce(current_record.transport_avg, 0) / baseline_record.transportation_emissions) * 100)
               else 0 
           end as percentage
    union all
    select 'energy'::text,
           coalesce(current_record.energy_avg, 0),
           coalesce(baseline_record.energy_emissions, 0),
           greatest(0, coalesce(baseline_record.energy_emissions, 0) - coalesce(current_record.energy_avg, 0)),
           case 
               when coalesce(baseline_record.energy_emissions, 0) > 0 
               then greatest(0, (1 - coalesce(current_record.energy_avg, 0) / baseline_record.energy_emissions) * 100)
               else 0 
           end
    union all
    select 'diet'::text,
           coalesce(current_record.diet_avg, 0),
           coalesce(baseline_record.diet_emissions, 0),
           greatest(0, coalesce(baseline_record.diet_emissions, 0) - coalesce(current_record.diet_avg, 0)),
           case 
               when coalesce(baseline_record.diet_emissions, 0) > 0 
               then greatest(0, (1 - coalesce(current_record.diet_avg, 0) / baseline_record.diet_emissions) * 100)
               else 0 
           end
    union all
    select 'waste'::text,
           coalesce(current_record.waste_avg, 0),
           coalesce(baseline_record.waste_emissions, 0),
           greatest(0, coalesce(baseline_record.waste_emissions, 0) - coalesce(current_record.waste_avg, 0)),
           case 
               when coalesce(baseline_record.waste_emissions, 0) > 0 
               then greatest(0, (1 - coalesce(current_record.waste_avg, 0) / baseline_record.waste_emissions) * 100)
               else 0 
           end;
end;
$$ language plpgsql; 