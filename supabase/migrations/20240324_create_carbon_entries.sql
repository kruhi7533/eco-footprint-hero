-- Create carbon entries table for detailed daily tracking
create table carbon_entries (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    entry_date date not null default current_date,
    
    -- Transportation details
    transport_type text,
    transport_distance float default 0,
    transport_emissions float default 0,
    
    -- Energy usage
    energy_source text,
    energy_consumption float default 0,
    energy_emissions float default 0,
    
    -- Diet tracking
    meal_type text,
    meat_consumption float default 0,
    diet_emissions float default 0,
    
    -- Waste management
    waste_type text,
    waste_amount float default 0,
    waste_emissions float default 0,
    
    -- Metadata
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table carbon_entries enable row level security;

-- Create policies
create policy "Users can view their own carbon entries"
on carbon_entries for select
using (auth.uid() = user_id);

create policy "Users can insert their own carbon entries"
on carbon_entries for insert
with check (auth.uid() = user_id);

create policy "Users can update their own carbon entries"
on carbon_entries for update
using (auth.uid() = user_id);

-- Create indexes for better query performance
create index idx_carbon_entries_user_date on carbon_entries(user_id, entry_date);

-- Create a function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create a trigger to automatically update the updated_at column
create trigger update_carbon_entries_updated_at
    before update on carbon_entries
    for each row
    execute function update_updated_at_column(); 