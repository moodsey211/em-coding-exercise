alter table "public"."courses_likes" enable row level security;

create policy "select_courses_likes_policy"
on "public"."courses_likes"
as permissive
for select
to authenticated
using (public.owns_record_as_user(user_id));

create policy "update_courses_likes_policy"
on "public"."courses_likes"
as permissive
for update
to authenticated
using (public.owns_record_as_user(user_id));

create policy "delete_courses_likes_policy"
on "public"."courses_likes"
as permissive
for delete
to authenticated
using (public.owns_record_as_user(user_id));