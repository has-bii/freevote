-- Function to handle user update in profiles
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  UPDATE public.profiles
  SET full_name = new.raw_user_meta_data ->> 'full_name',
      avatar = new.raw_user_meta_data ->> 'avatar_url'
  WHERE id = new.id;
  RETURN new;
END;
$$;

-- Function to handle new user insertion in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN new;
END;
$$;