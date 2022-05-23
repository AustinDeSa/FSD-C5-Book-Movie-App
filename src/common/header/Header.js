import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.svg';
import { Tab, Tabs, Button, FormControl } from "@material-ui/core";
import PropTypes from 'prop-types';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';

// Function for Tabs
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div sx={{ p: 2 }}>
                    {children}
                </div>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Header = function (props) {
    // Register Code //
    // State for Register
    const [addRegisterForm, setAddRegisterForm] = useState({
        id: 0,
        first_name: '',
        last_name: '',
        email_address: '',
        password: '',
        mobile_number: '',
    });

    // Register form onChange
    const inputRegChangedHandler = (e) => {
        const state = addRegisterForm;
        state[e.target.name] = e.target.value;
        setAddRegisterForm({ ...state })
    }

    const { first_name, last_name, email_address, password, mobile_number } = addRegisterForm;

    // Register Form Submit
    const onRegisterFormSubmitted = (e) => {
        e.preventDefault();

        try {

            fetch("http://localhost:8085/api/v1/signup",
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(addRegisterForm)
                }
            );

            setLabelShow({
                label_value: false
            });

        } catch (e) {

            alert(`Error: ${e.message}`);

        }
    }
    // Register Code //

    // Login Code //
    // State for Login
    const [addLoginForm, setAddLoginForm] = useState({
        id: 0,
        email: '',
        pass_word: '',
    });

    // Login form onChange
    const inputLoginChangedHandler = (e) => {
        const state = addLoginForm;
        state[e.target.name] = e.target.value;
        setAddLoginForm({ ...state })
    }

    const { email, pass_word } = addLoginForm;

    const onLoginFormSubmitted = (e) => {
        e.preventDefault();

        try {

            const param = window.btoa(`${email}:${pass_word}`);

            const rawResponse = fetch("http://localhost:8085/api/v1/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        authorization: `Basic ${param}`
                    }
                }
            ).then(response =>
                response.json().then(data => ({
                    status: response.status,
                    data: rawResponse
                })
                ).then(res => {
                    if (response.ok) {
                        window.sessionStorage.setItem('user-details', JSON.stringify(response));
                        window.sessionStorage.setItem('access-token', response.headers.get('access-token'));
                        setButtonForm({
                            btn_name: 'LOGOUT'
                        });
                        setShow(false);
                    } else {
                        const error = new Error();
                        error.message = response.message || 'Something went wrong.';
                    }

                    setAddLoginForm({ id: 0, email: '', pass_word: '', });
                }));

        } catch (e) {

            alert(`Error: ${e.message}`);

        }
    }
    // Login Code //

    // Logout Code //
    const onLogoutFormSubmitted = (e) => {
        e.preventDefault();

        try {

            const accessToken = window.sessionStorage.getItem('access-token');

            fetch("http://localhost:8085/api/v1/auth/logout",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        authorization: `Bearer ${accessToken}`
                    }
                }
            );

            window.sessionStorage.setItem('user-details', null);
            window.sessionStorage.setItem('access-token', null);

            setButtonForm({
                btn_name: 'LOGIN'
            });

        } catch (e) {

            alert(`Error: ${e.message}`);

        }
    }
    // Logout Code //

    // Button Value //
    // State for Button
    const [addButtonForm, setButtonForm] = useState({
        btn_name: window.sessionStorage.getItem('access-token') === null || window.sessionStorage.getItem('access-token') === 'null' ? 'LOGIN' : 'LOGOUT',
    });

    const { btn_name } = addButtonForm;
    // Button Value //

    // State for Modal //
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);

        setLabelShow({
            label_value: true
        });

        setAddRegisterForm({ id: 0, first_name: '', last_name: '', email_address: '', password: '', mobile_number: '', });
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    // State for Modal //

    // State for Success Message Label //
    const [showLabel, setLabelShow] = useState({
        label_value: true,
    });

    const { label_value } = showLabel;
    // State for Success Message Label //

    // Redirect to book show page //
    const history = useHistory();

    const onBookShowSubmitted = () => {
        history.push('/bookshow/:id');
    }
    // Redirect to book show page //

    return (
        <div className="header">
            <img src={logo} className='header-logo' alt=''></img>
            <nav className="header-nav">
                <Button variant="contained" className={"header-bookshow " + props.showButton} color="primary"
                    onClick={btn_name === 'LOGIN' ? handleShow : onBookShowSubmitted}>BOOK SHOW</Button>
                <Button variant="contained" className="header-login-logout" color="default" onClick={btn_name === 'LOGIN' ? handleShow : onLogoutFormSubmitted}>{btn_name}</Button>
            </nav>

            <Modal isOpen={show} shouldCloseOnOverlayClick={true} className="modal" ariaHideApp={false}
                onRequestClose={handleClose} >
                <div className="modal-main">
                    <div className="modal-container">
                        <div style={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="LOGIN" {...a11yProps(0)} />
                                <Tab label="REGISTER" {...a11yProps(1)} />
                            </Tabs>
                        </div>
                        <TabPanel value={value} index={0}>
                            <ValidatorForm className="login-form" onSubmit={onLoginFormSubmitted}>
                                <FormControl>
                                    <TextValidator id="username" label="Username *" type="text" name="email"
                                        validators={['required']} errorMessages={['Required']} onChange={inputLoginChangedHandler}
                                        value={email} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <FormControl>
                                    <TextValidator id="password" label="Password *" type="password" name="pass_word"
                                        validators={['required']} errorMessages={['Required']} onChange={inputLoginChangedHandler}
                                        value={pass_word} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <button type="submit" className="custom-btn login-btn">LOGIN</button>
                            </ValidatorForm>
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <ValidatorForm className="register-form" onSubmit={onRegisterFormSubmitted}>
                                <FormControl>
                                    <TextValidator id="firstname" label="First Name *" type="text" name="first_name"
                                        validators={['required']} errorMessages={['Required']} onChange={inputRegChangedHandler}
                                        value={first_name} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <FormControl>
                                    <TextValidator id="lastname" label="Last Name *" type="text" name="last_name"
                                        validators={['required']} errorMessages={['Required']} onChange={inputRegChangedHandler}
                                        value={last_name} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <FormControl>
                                    <TextValidator id="email" label="Email *" type="email" name="email_address"
                                        validators={['required']} errorMessages={['Required']} onChange={inputRegChangedHandler}
                                        value={email_address} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <FormControl>
                                    <TextValidator id="password" label="Password *" type="password" name="password"
                                        validators={['required']} errorMessages={['Required']} onChange={inputRegChangedHandler}
                                        value={password} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />
                                <FormControl>
                                    <TextValidator id="contact" label="Contact No *" type="number" name="mobile_number"
                                        validators={['required']} errorMessages={['Required']} onChange={inputRegChangedHandler}
                                        value={mobile_number} className="input-control">
                                    </TextValidator>
                                </FormControl><br /><br />

                                <label hidden={label_value}>Registration Succesful. Please Login!</label><br /><br />

                                <button type="submit" className="custom-btn register-btn">REGISTER</button>
                            </ValidatorForm>
                        </TabPanel>
                    </div>
                </div>
            </Modal >
        </div >
    )
}

export default Header;