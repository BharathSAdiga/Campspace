import React from 'react';
import { PlaceholderPage } from '../../components/common/PlaceholderPage';

export const LoginPage = () => {
  return (
    <PlaceholderPage
      title="Sign In"
      description="Authentication portal for students, organizers, and campus administration."
      module="Authentication"
      owner="Shared"
      routePath="/login"
    />
  );
};
