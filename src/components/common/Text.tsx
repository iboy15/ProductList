import React from 'react';
import styled from 'styled-components/native';

// Define the props for the Text component
interface TextProps {
  children: React.ReactNode;
  bold?: boolean;
  size?: number;
  color?: string;
  style?: any; // Allow custom styles
  numberOfLines?: number; // Corrected prop name
}

// Styled component for the Text
const StyledText = styled.Text<TextProps>`
  font-size: ${({ size }) => size || 14}px;
  font-weight: ${({ bold }) => (bold ? 'bold' : 'normal')};
  color: ${({ color, theme }) => color || theme.textPrimary};
`;

// Text component
const Text: React.FC<TextProps> = ({ children, bold, size, color, style, numberOfLines }) => {
  return (
    <StyledText
      numberOfLines={numberOfLines} // Corrected prop name
      bold={bold}
      size={size}
      color={color}
      style={style}
    >
      {children}
    </StyledText>
  );
};

export default Text;