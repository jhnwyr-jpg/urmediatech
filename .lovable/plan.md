

## Client Dashboard Enhancement Plan

The user wants 4 improvements to the client dashboard: editable profile, avatar upload, password change, and better UI.

### 1. Create Storage Bucket for Avatars
- SQL migration to create `avatars` storage bucket (public)
- RLS policies: authenticated users can upload/update their own avatar, anyone can read

### 2. Editable Profile Settings (Settings tab)
- Replace the current read-only profile display with editable form fields (name, phone, address)
- Email remains read-only (tied to auth)
- Add avatar upload with preview circle at top of settings
- Upload to `avatars/{user_id}` path, save URL to `profiles.avatar_url`
- Save button calls `supabase.from('profiles').update(...)` 
- Success/error toast feedback

### 3. Password Change
- Add a "Change Password" section in settings tab
- Fields: new password, confirm password
- Uses `supabase.auth.updateUser({ password })` -- no current password needed as user is already authenticated
- Validation: minimum 6 chars, passwords must match

### 4. Dashboard UI Improvements
- Add avatar display in welcome header (circle with initials fallback)
- Better stat cards with subtle gradients/shadows
- Service cards instead of plain table on mobile
- Improve the overall card styling with hover effects
- Better visual hierarchy in sidebar with active indicator

### Files to Modify
- **SQL Migration**: Create `avatars` bucket + RLS policies
- **`src/pages/client/Dashboard.tsx`**: All UI changes -- editable profile form, avatar upload, password change section, improved stats/cards design

### Technical Notes
- Profile update uses existing RLS policy "Users can update their own profile" 
- Avatar stored at `avatars/{userId}/avatar.{ext}` with cache-busting query param
- The `profiles` table already has `avatar_url` column

