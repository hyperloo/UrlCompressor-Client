import React, { Component } from "react";
import axios from "axios";
import AuthContext from "../../context/auth-context";
import { api } from "../../api";

import { Spinner, Input, FormGroup, Button, Row, Col } from "reactstrap";
import Url from "./url";
import Message from "../Message";

import "./url.scss";

class urlPage extends Component {
	state = {
		loading: false,
		urls: [],
		searchedUrls: [],
		longUrl: "",
		lastDate: "",
		customName: "",
		creating: false,
	};
	static contextType = AuthContext;

	loadUrls = async () => {
		try {
			this.setState({ loading: true });
			const res = await axios.get(`${api}/urls`, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": `${this.context.token}`,
				},
			});
			this.setState({
				loading: false,
				urls: [...res.data.url],
				searchedUrls: [...res.data.url],
			});
		} catch (err) {
			if (err.response) {
				this.setState({ loading: false });
				if (err.response.status === 401) {
					await this.context.errorLogout(err.response.data.msg);
				} else {
					this.context.createMessage(false, err.response.data.msg);
				}
			}
		}
	};

	async componentDidMount() {
		await this.loadUrls();
	}

	createHandler = async () => {
		this.setState({ loading: true, creating: true });
		if (this.state.longUrl.trim() === "") {
			this.context.createMessage(false, "Fill all the fields");
			await this.setState({
				loading: false,
				creating: false,
				longUrl: "",
				lastDate: "",
			});
			return;
		}
		const body = {
			longUrl: this.state.longUrl.trim(),
			lastDate: this.state.lastDate !== "" ? this.state.lastDate : null,
			code: this.state.customName !== "" ? this.state.customName : null,
		};
		try {
			const res = await axios.post(`${api}/urls/compress`, body, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": `${this.context.token}`,
				},
			});
			this.setState((prevState) => {
				return {
					urls: [res.data.url, ...prevState.urls],
					searchedUrls: [res.data.url, ...prevState.searchedUrls],
				};
			});
			this.context.createMessage(true, res.data.msg);
			this.setState({
				loading: false,
				creating: false,
				longUrl: "",
				lastDate: "",
				code: "",
			});
		} catch (err) {
			if (err.response) {
				this.setState({ loading: false, creating: false, code: "" });
				if (err.response.status === 401) {
					await this.context.errorLogout(err.response.data.msg);
				} else {
					this.context.createMessage(false, err.response.data.msg);
				}
			}
		}
	};

	clickHandler = (key) => {
		this.setState((prevState) => {
			const newUrls = [...prevState.urls];
			newUrls[key].clicks++;
			const newSearchedUrls = [...prevState.searchedUrls];
			return {
				urls: newUrls,
				searchedUrls: newSearchedUrls,
			};
		});
	};

	deleteHandler = async (ind, id) => {
		try {
			const res = await axios.delete(`${api}/urls/${id}`, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": `${this.context.token}`,
				},
			});
			this.setState((prevState) => {
				const urls = [...prevState.urls];
				urls.splice(ind, 1);
				const searchedUrls = [...prevState.searchedUrls];
				searchedUrls.splice(ind, 1);
				return {
					urls: urls,
					searchedUrls: searchedUrls,
				};
			});
			this.context.createMessage(true, res.data.msg);
		} catch (err) {
			if (err.response.status === 401) {
				await this.context.errorLogout(err.response.data.msg);
			} else {
				this.context.createMessage(false, err.response.data.msg);
			}
		}
	};

	updateHandler = async (ind, id, last, status) => {
		try {
			const body = { lastDate: last ? last : null, status: status };
			if (!last && this.state.urls[ind].lastDate !== null) {
				body.lastDate = this.state.urls[ind].lastDate;
			}
			const res = await axios.patch(`${api}/urls/${id}`, body, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": `${this.context.token}`,
				},
			});
			await this.setState((prevState) => {
				const newUrls = [...prevState.urls];
				newUrls[ind].lastDate = res.data.url.lastDate;
				newUrls[ind].status = status;
				const newSearchedUrls = [...prevState.searchedUrls];
				return {
					urls: newUrls,
					searchedUrls: newSearchedUrls,
				};
			});
			await this.context.createMessage(true, res.data.msg);
		} catch (err) {
			if (err.response) {
				if (err.response.status === 401) {
					await this.context.errorLogout(err.response.data.msg);
				} else {
					this.context.createMessage(false, err.response.data.msg);
				}
			}
		}
	};

	searchHandler = async (e) => {
		this.context.createMessage(false, null);
		const filtered = await this.state.urls.filter((url) => {
			return url.longUrl.toLowerCase().includes(e.target.value.toLowerCase());
		});
		this.setState({ searchedUrls: filtered });
	};

	customSearchHandler = async (code) => {
		if (!code)
			return await this.context.createMessage(
				false,
				"Enter URL Code to search"
			);

		try {
			const res = await axios.get(`${api}/urls/code`, {
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": `${this.context.token}`,
				},
				params: {
					code: code,
				},
			});
			await this.context.createMessage(!res.present, res.data.msg);
			this.setState({ code: "" });
		} catch (err) {
			this.setState({ loading: false, code: "" });
			if (err.response) {
				if (err.response.status === 401)
					await this.context.errorLogout(err.response.data.msg);
				else await this.context.createMessage(false, err.response.data.msg);
			}
		}
	};

	render() {
		return (
			<div className="url-div">
				<FormGroup
					style={{
						border: "1px solid black",
						borderRadius: "5px",
						padding: "1rem",
					}}
				>
					<Row>
						<Col className="no-gutters column py-2 pr-1" md={8}>
							<Input
								type="text"
								name="longUrl"
								value={this.state.longUrl}
								onChange={(e) => {
									this.context.createMessage(false, null);
									this.setState({ longUrl: e.target.value });
								}}
								placeholder="Enter Url to be compressed"
							/>
						</Col>
						<Col
							className="no-gutters column py-2 pl-1"
							md={4}
							style={{ position: "relative" }}
						>
							<Input
								type="text"
								name="customName"
								value={this.state.customName}
								onChange={(e) => {
									this.context.createMessage(false, null);
									this.setState({ customName: e.target.value });
								}}
								placeholder="Custom Code"
							/>
							<span
								role="img"
								aria-label="search"
								onClick={() => this.customSearchHandler(this.state.customName)}
								style={{
									position: "absolute",
									right: "0",
									top: "0",
									transform: "translateY(25%)",
									cursor: "pointer",
									display: "inline-block",
									minWidth: "2rem",
									height: "2rem",
									fontSize: "1.25rem",
								}}
							>
								{" "}
								🔎
							</span>
						</Col>

						<Col className="no-gutters column date py-2 pr-md-1 pb-2" md={8}>
							<Input
								placeholder="Date of Expiration"
								type="text"
								name="lastDate"
								value={this.state.lastDate}
								onFocus={(e) => (e.target.type = "date")}
								onChange={(e) => {
									this.context.createMessage(false, null);
									this.setState({ lastDate: e.target.value });
								}}
							/>
							{/* <div className="tooltip">Enter Expiration Date of Link</div> */}
						</Col>
						<Col className="no-gutters column py-2 pl-md-1 pb-2" md={4}>
							<Button type="submit" onClick={this.createHandler} className="">
								Compress{" "}
								{this.state.loading && this.state.creating && (
									<Spinner size="sm" className="smallSpinner" color="white" />
								)}
							</Button>
						</Col>
					</Row>
				</FormGroup>

				{this.context.msg && (
					<Message status={this.context.status} msg={this.context.msg} />
				)}
				<section className="search-div">
					<Input
						className="search"
						type="text"
						placeholder="Search Compressed URL"
						onChange={this.searchHandler}
					/>
					<span role="img" style={{ fontSize: "1.1rem" }}>
						{" "}
						&#x1F50D;
					</span>
				</section>
				{this.state.loading && !this.state.creating ? (
					<Spinner className="bigSpinner" />
				) : this.state.searchedUrls.length === 0 ? (
					<div className="emptyText">No URLs are Compressed Here!</div>
				) : (
					<ul>
						{this.state.searchedUrls.map((url, i) => (
							<Url
								url={url}
								clickHandler={this.clickHandler}
								deleteHandler={this.deleteHandler}
								updateHandler={this.updateHandler}
								key={i}
								ind={i}
							/>
						))}
					</ul>
				)}
			</div>
		);
	}
}

export default urlPage;
