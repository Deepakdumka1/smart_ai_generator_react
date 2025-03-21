const handlePhotoChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Only accept image files
  if (!file.type.startsWith('image/')) {
    setError('Please select an image file');
    return;
  }

  // Add file size check (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    setError('Image size should be less than 5MB');
    return;
  }

  setPhotoLoading(true);
  setError('');
  setSuccess('');

  try {
    // Optimized compression options
    const options = {
      maxSizeMB: 0.5,               // Max size in MB
      maxWidthOrHeight: 600,        // Reduce max dimensions but keep reasonable quality
      useWebWorker: true,
      initialQuality: 0.7,          // Initial compression quality
      fileType: file.type           // Keep the original file type
    };

    // Add timeout to prevent infinite compression
    const compressionPromise = imageCompression(file, options);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Compression timed out')), 10000)
    );

    // Race the compression against a timeout
    let compressedFile;
    try {
      compressedFile = await Promise.race([
        compressionPromise,
        timeoutPromise
      ]);
      
      // If compressed file is larger than original, use original
      if (compressedFile.size > file.size) {
        console.log('Using original file as compression increased size');
        compressedFile = file;
      }
    } catch (compressionError) {
      console.error('Image compression failed, using original file:', compressionError);
      compressedFile = file;
    }

    // Upload the file
    await updateProfilePhoto(compressedFile);
    setSuccess('Profile photo updated successfully');
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  } catch (err) {
    console.error('Error updating profile photo:', err);
    setError(`Failed to update profile photo: ${err.message || 'Please try again'}`);
  } finally {
    setPhotoLoading(false);
  }
};

// Also update the AvatarOverlay component to provide better feedback
const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.loading ? 1 : 0};
  transition: opacity 0.3s;
  cursor: ${props => props.loading ? 'default' : 'pointer'};
  
  &:hover {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    &:active {
      opacity: 1;
    }
  }
`;

// And update how you use this component
<AvatarOverlay onClick={!photoLoading ? handlePhotoClick : undefined} loading={photoLoading}>
  <ChangePhotoText>
    {photoLoading ? 'Processing...' : 'Change Photo'}
  </ChangePhotoText>
  {!photoLoading && currentUser.photoURL && (
    <RemovePhotoText onClick={handleRemovePhoto}>
      Remove Photo
    </RemovePhotoText>
  )}
</AvatarOverlay>