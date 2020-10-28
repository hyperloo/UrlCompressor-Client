import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input, Spinner } from "reactstrap";
import axios from "axios";
import { api } from "../../api";

import AuthContext from "../../context/auth-context";
import Message from "../Message";
import "./auth.scss";

const AuthPage = () => {
	const [state, changeState] = useState("login");
	const [loading, toggleLoading] = useState(false);
	const [name, changeName] = useState("");
	const [email, changeEmail] = useState("");
	const [password, changePassword] = useState("");

	const onSubmitHandler = async (e, login, createMessage) => {
		e.preventDefault();
		toggleLoading(true);
		const body = {
			name: name,
			email: email,
			password: password,
		};
		try {
			const res = await axios.post(`${api}/${state}`, body, {
				headers: {
					"Content-Type": "application/json",
				},
			});
			login(res.data.token, res.data.user, `${state} Successful`);
			toggleLoading(false);
		} catch (err) {
			if (err.response) {
				createMessage(false, err.response.data.msg);
				toggleLoading(false);
			}
		}
	};

	return (
		<AuthContext.Consumer>
			{(context) => {
				return (
					<div className="parent-auth">
						<div className="auth-container">
							<button
								className={
									state === "login" ? "btn btn-lg active" : "btn btn-lg"
								}
								onClick={() => changeState("login")}
							>
								Login
							</button>
							<button
								className={
									state === "register" ? "btn btn-lg active" : "btn btn-lg"
								}
								onClick={() => changeState("register")}
							>
								Register
							</button>
						</div>
						{context.msg && (
							<Message status={context.status} msg={context.msg} />
						)}

						<Form
							className="authForm"
							onSubmit={(e) =>
								onSubmitHandler(e, context.login, context.createMessage)
							}
						>
							{state === "register" && (
								<FormGroup>
									<Label for="Name">Name</Label>
									<Input
										type="text"
										name="name"
										placeholder="John Doe"
										onChange={(e) => {
											context.createMessage(false, null);
											changeName(e.target.value);
										}}
									/>
								</FormGroup>
							)}
							<FormGroup>
								<Label for="Email">Email</Label>
								<Input
									type="email"
									name="email"
									placeholder="abc@gmail.com"
									onChange={(e) => {
										context.createMessage(false, null);
										changeEmail(e.target.value);
									}}
								/>
							</FormGroup>
							<FormGroup>
								<Label for="Password">Password</Label>
								<Input
									type="password"
									name="password"
									placeholder="*****"
									onChange={(e) => {
										context.createMessage(false, null);
										changePassword(e.target.value);
									}}
								/>
							</FormGroup>
							<Button>
								{state === "login" ? "Login" : "Register"}{" "}
								{loading && (
									<>
										&nbsp;&nbsp;
										<Spinner size="sm" color="white" />
										&nbsp;&nbsp;
									</>
								)}
							</Button>
						</Form>
					</div>
				);
			}}
		</AuthContext.Consumer>
	);
};

export default AuthPage;
