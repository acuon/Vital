import { useState } from "react"
import "./Register.css"
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { SHA256, enc } from "crypto-js";
import Lottie from "lottie-react";
import { createUserAPIMethod } from "../../api/auth";
import { useDispatch } from "react-redux";

import { login } from "../../features/userSlice";
import landingData1 from "../../assets/Lottie/ProcessIndicator.json";

const Register = () => {
    const navigate = useNavigate();
    const [failed, setFailed] = useState(false);
    const [registerLoading, setRegisterIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPwd: ''
    });

    const style = {
        height: 50,
        width: 50,
      };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPwd) {
            setErrorMessage("Passwords does not match.");
            return;
        }

        setRegisterIsLoading(true); // Set loading to true when starting the registration

        // encrypt password
        let hashedPassword = SHA256(formData.password).toString(enc.Hex);
        const user = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: hashedPassword
        };
        createUserAPIMethod(user)
        .then((response) => {
            if (response.ok) {
                console.log("Successfully registered");
                navigate("/login");
            } else {
                console.log("Invalid register");
                setFailed(true);
            }
        })
        .catch((err) => {
            console.error("Error registering user:", err);
        })
        .finally(() => {
            setRegisterIsLoading(false);
        });
    };

    const signIn = () => {
        navigate("/login");
    }
      
    return (
        <div className="registration-form-container">
            <div className="registration-form-sub-container">
                <form className="registration-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <TextField
                            type="firstName"
                            variant="standard"
                            onChange={handleChange}
                            name="firstName"
                            value={formData.firstName}
                            required
                            fullWidth
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <TextField
                            id="lastName"
                            type="text"
                            variant="standard"
                            onChange={handleChange}
                            name="lastName"
                            value={formData.lastName}
                            required
                            fullWidth
                        />
                    </div>

                    <div>
                        <label htmlFor="email">Email:</label>
                        <TextField
                            id="email"
                            type="email"
                            variant="standard"
                            onChange={handleChange}
                            name="email"
                            value={formData.email}
                            required
                            fullWidth
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <TextField
                            id="password"
                            type="password"
                            variant="standard"
                            onChange={handleChange}
                            name="password"
                            value={formData.password}
                            required
                            fullWidth
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPwd">Confirm Password</label>
                        <TextField
                            id="confirmPwd"
                            type="password"
                            variant="standard"
                            onChange={handleChange}
                            name="confirmPwd"
                            value={formData.confirmPwd}
                            required
                            fullWidth
                        />
                    </div>
                    {errorMessage && (
                        <div className="pwd_err ui negative mini message">
                            {errorMessage}
                        </div>
                    )}

                    <div className="buttons">
                        {registerLoading ? (
                            <div
                                style={{
                                display: "flex",
                                justifyContent: "space-around",
                                }}
                            >
                                <Lottie animationData={landingData1} style={style} />
                            </div>
                            ) : (
                            <Button type="submit" variant="contained">Register</Button>
                        )}
                        <Button variant="outlined" onClick={signIn}>Sign In</Button>
                    </div>

                    {failed && (
                        <p className="ui negative mini message">
                            Registration failed. Please check your information and make sure
                            that the account has not been created.
                        </p>
                    )}
                </form>
            </div>
        </div>
    )
}

export default Register