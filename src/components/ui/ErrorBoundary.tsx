import React from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box py={10}>
          <VStack spacing={4}>
            <Text fontSize="lg" fontWeight="bold" color="brand.dark">
              Oops, something went wrong.
            </Text>
            <Text fontSize="sm" color="gray.600">
              Please try again.
            </Text>
            <Button onClick={this.handleReset} colorScheme="green">
              Try again
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}
