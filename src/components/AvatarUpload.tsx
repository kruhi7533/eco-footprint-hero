import React, { useState, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export function AvatarUpload() {
  const { profile, refreshProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Please upload a valid image file (PNG, JPG, or JPEG)');
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting upload process with file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        console.log('Preview URL created successfully');
      };
      reader.readAsDataURL(file);

      if (!profile?.id) {
        throw new Error('User profile ID not found');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
      console.log('Preparing to upload file:', fileName);
      
      // Delete old avatar if exists
      if (profile.avatar_url) {
        console.log('Removing old avatar...');
        const oldFileName = profile.avatar_url.split('/').pop();
        if (oldFileName) {
          const { error: removeError } = await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
          
          if (removeError) {
            console.error('Error removing old avatar:', removeError);
            // Continue with upload even if remove fails
          } else {
            console.log('Old avatar removed successfully');
          }
        }
      }

      console.log('Starting new file upload...');
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully, getting public URL...');
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Got public URL:', publicUrl);
      console.log('Updating profile with new avatar URL...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully, refreshing profile...');
      await refreshProfile();
      toast.success('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Error in upload process:', error);
      toast.error(error.message || 'Failed to upload profile picture');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploading(true);

      if (profile?.avatar_url) {
        const fileName = profile.avatar_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([fileName]);
        }
      }

      // Update profile to remove avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', profile?.id);

      if (updateError) throw updateError;

      setPreviewUrl(null);
      await refreshProfile();
      toast.success('Profile picture removed');
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast.error(error.message || 'Failed to remove profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className={`relative group cursor-pointer rounded-full transition-all duration-200 ${isDragging ? 'scale-105' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Avatar className="w-24 h-24 border-2 border-primary/20">
          <AvatarImage
            src={previewUrl || profile?.avatar_url || '/images/default-avatar.svg'}
            alt={profile?.name || 'User'}
          />
          <AvatarFallback>{profile?.name ? getInitials(profile.name) : 'U'}</AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        <div className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isUploading ? 'opacity-100' : ''}`}>
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-white" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
        </Button>
        {(profile?.avatar_url || previewUrl) && (
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={handleRemoveAvatar}
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        Supported formats: PNG, JPG, JPEG (max 5MB)
      </p>
      <p className="text-sm text-muted-foreground">
        Click or drag and drop to upload
      </p>
    </div>
  );
} 