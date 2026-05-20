import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../redux/slices/authSlice';
import {FaEye, FaEyeSlash} from "react-icons/fa6";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [passwordErrors, setPasswordErrors] = useState({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });

    const validatePassword = (pass) => {
        const newErrors = {
            minLength: pass.length >= 12,
            hasUppercase: /[A-Z]/.test(pass),
            hasLowercase: /[a-z]/.test(pass),
            hasNumber: /\d/.test(pass),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
        };
        setPasswordErrors(newErrors);
        return Object.values(newErrors).every(Boolean);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const isPasswordValid = Object.values(passwordErrors).every(Boolean);

    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!isPasswordValid) {
            setError('Password does not meet the requirements');
            return;
        }

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            await dispatch(resetPassword({
                token,
                password,
                passwordConfirm: confirmPassword
            })).unwrap();

            setMessage('Password has been reset successfully. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <FormContainer>
                <form onSubmit={handleSubmit} className="form" noValidate>
                    <h2>Reset Your Password</h2>
                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <div className="form-group">
                        <label>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={handlePasswordChange}
                                placeholder="Enter new password"
                                required
                                minLength="12"
                                className={password && !isPasswordValid ? 'border-red-500' : ''}
                                style={{ paddingRight: '40px', width: '100%' }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? (
                                    <FaEye size={14} className="text-neutral-500 hover:text-black"/>
                                ) : (
                                    <FaEyeSlash size={16} className="text-neutral-500 hover:text-black"/>
                                )}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-3 mb-4 p-3 bg-neutral-50 rounded-lg dark:bg-neutral-800 text-xs">
                                <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password must contain:</p>
                                <ul className="space-y-1">
                                    <li className={`flex items-center ${passwordErrors.minLength ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{passwordErrors.minLength ? '✓' : '•'}</span>
                                        At least 12 characters
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{passwordErrors.hasUppercase ? '✓' : '•'}</span>
                                        1 uppercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{passwordErrors.hasLowercase ? '✓' : '•'}</span>
                                        1 lowercase letter
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{passwordErrors.hasNumber ? '✓' : '•'}</span>
                                        1 number
                                    </li>
                                    <li className={`flex items-center ${passwordErrors.hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        <span className="mr-2">{passwordErrors.hasSpecialChar ? '✓' : '•'}</span>
                                        1 special character
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                required
                                minLength="12"
                                style={{ paddingRight: '40px', width: '100%' }}
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showConfirmPassword ? (
                                    <FaEye size={14} className="text-neutral-500 hover:text-black"/>
                                ) : (
                                    <FaEyeSlash size={16} className="text-neutral-500 hover:text-black"/>
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="button-submit"
                        disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </FormContainer>
        </Container>
    );
};

// Reuse the styled components from ForgotPassword
const Container = styled.div`
    display: flex;
    min-height: 90vh;
    width: 100%;
    background-color: #f8fafc;
    
    .dark & {
        background-color: #0a0a0a;
    }
`;

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 2rem;
    
    .form {
        width: 100%;
        max-width: 400px;
        background: white;
        padding: 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        
        .dark & {
            background-color: #2d2d2d;
            color: #f5f5f5;
        }
    }
    
    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
        font-weight: 600;
    }
    
    .form-group {
        margin-bottom: 1rem;
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #4a5568;
            
            .dark & {
                color: #e2e8f0;
            }
        }
        
        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 1rem;
            
            .dark & {
                background-color: #3d3d3d;
                border-color: #4a5568;
                color: #f5f5f5;
            }
        }
    }
    
    .button-submit {
        width: 100%;
        padding: 0.75rem;
        background-color: #000000;
        color: white;
        border: none;
        border-radius: 0.375rem;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        transition: background-color 0.2s;
        
        &:hover {
            background-color: #333333;
        }
        
        &:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }
    }
    
    .error-message {
        color: #e53e3e;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #fff5f5;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        
        .dark & {
            background-color: #2d1a1a;
        }
    }
    
    .success-message {
        color: #38a169;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #f0fff4;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        
        .dark & {
            background-color: #1a2e1f;
        }
    }
`;

export default ResetPassword;