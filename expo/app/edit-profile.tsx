import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/colors';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.fullName?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.avatar || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (showPasswordChange) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (!newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const openCamera = () => {
    // In a real app, this would open the camera
    console.log('Opening camera...');
    // For demo, set a placeholder image
    setProfilePhoto('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face');
  };

  const openGallery = () => {
    // In a real app, this would open the gallery
    console.log('Opening gallery...');
    // For demo, set a placeholder image
    setProfilePhoto('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face');
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = {
        fullName: `${firstName} ${lastName}`.trim(),
        email,
        username,
        avatar: profilePhoto,
        ...(showPasswordChange && newPassword && { password: newPassword }),
      };

      await updateProfile(updatedData);
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
            ) : (
              <View style={styles.placeholderPhoto}>
                <Text style={styles.placeholderText}>
                  {firstName.charAt(0)}{lastName.charAt(0)}
                </Text>
              </View>
            )}
            <Pressable style={styles.cameraButton} onPress={handleChangePhoto}>
              <Camera color={Colors.white} size={16} />
            </Pressable>
          </View>
          <Pressable onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
            error={errors.firstName}
            placeholder="Enter your first name"
          />

          <Input
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
            error={errors.lastName}
            placeholder="Enter your last name"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Username / Pseudo"
            value={username}
            onChangeText={setUsername}
            error={errors.username}
            placeholder="Enter your username"
            autoCapitalize="none"
          />

          {/* Password Section */}
          <View style={styles.passwordSection}>
            <Pressable
              style={styles.passwordToggle}
              onPress={() => setShowPasswordChange(!showPasswordChange)}
            >
              <Text style={styles.passwordToggleText}>
                {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
              </Text>
            </Pressable>

            {showPasswordChange && (
              <>
                <Input
                  label="Current Password"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  error={errors.currentPassword}
                  placeholder="Enter current password"
                  secureTextEntry
                />

                <Input
                  label="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  error={errors.newPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                />

                <Input
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
              </>
            )}
          </View>

          {/* Subscription Section */}
          <View style={styles.subscriptionSection}>
            <Text style={styles.sectionTitle}>Subscription</Text>
            <View style={styles.subscriptionInfo}>
              <Text style={styles.subscriptionPlan}>
                {user?.subscription === 'premium' ? 'Premium Plan' : 'Free Plan'}
              </Text>
              <Pressable onPress={() => router.push('/subscription')}>
                <Text style={styles.manageLink}>Manage Subscription</Text>
              </Pressable>
            </View>
          </View>

          {/* Notification Preferences */}
          <View style={styles.notificationSection}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            
            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Email Notifications</Text>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.notificationItem}>
              <Text style={styles.notificationLabel}>Push Notifications</Text>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <Button
          title={isLoading ? "Saving..." : "Save Changes"}
          onPress={handleSaveChanges}
          disabled={isLoading}
          size="large"
          style={[styles.saveButton, { backgroundColor: Colors.secondary }]}
          textStyle={{ color: Colors.cream }}
        />
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          size="large"
          style={[styles.cancelButton, { borderColor: Colors.secondary }]}
          textStyle={{ color: Colors.secondary }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  changePhotoText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  form: {
    paddingBottom: 32,
  },
  passwordSection: {
    marginVertical: 16,
  },
  passwordToggle: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  passwordToggleText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  subscriptionSection: {
    marginVertical: 24,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionPlan: {
    fontSize: 16,
    color: Colors.text,
  },
  manageLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  notificationSection: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  notificationLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  saveButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});