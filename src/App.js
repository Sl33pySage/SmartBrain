import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: "",
			imageUrl: "",
			box: {},
			route: "signin",
			isSignedIn: false,
			user: {
				id: "",
				name: "",
				email: "",
				entries: 0,
				joined: "",
			},
		};
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	// https://i0.wp.com/post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/03/GettyImages-1092658864_hero-1024x575.jpg?w=1155&h=1528
	calculateFaceLocation = (data) => {
		const clarifaiFace =
			data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - clarifaiFace.right_col * width,
			bottomRow: height - clarifaiFace.bottom_row * height,
		};
	};

	displayFaceBox = (box) => {
		this.setState({ box: box });
	};

	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};

	returnUpClarifaiRequestOptions = (imageUrl) => {
		// Your PAT (Personal Access Token) can be found in the portal under Authentification
		const PAT = "f30c49892b4e4d849489f7db7b7c657b";
		// Specify the correct user_id/app_id pairings
		// Since you're making inferences outside your app's scope
		const USER_ID = "w0bxsoq0vcor";
		const APP_ID = "2dd71ca815e148e2b488c30b96de634e";
		const IMAGE_URL = imageUrl;
		const raw = JSON.stringify({
			user_app_id: {
				user_id: USER_ID,
				app_id: APP_ID,
			},
			inputs: [
				{
					data: {
						image: {
							url: IMAGE_URL,
						},
					},
				},
			],
		});

		return {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: "Key " + PAT,
			},
			body: raw,
		};
	};

	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		fetch(
			"https://api.clarifai.com/v2/models/face-detection/outputs",
			this.returnUpClarifaiRequestOptions(this.state.input)
		)
			.then((response) => response.json())
			.then((result) => {
				if (result) {
					fetch("http://localhost:3000/image", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						});
				}
				this.displayFaceBox(this.calculateFaceLocation(result));
			})
			.catch((error) => console.log("error:", error));
	};

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState({ isSignedIn: false });
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};

	render() {
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
			<>
				<ParticlesBg type="cobweb" bg={true} />
				<div className="App">
					<Navigation
						isSignedIn={isSignedIn}
						onRouteChange={this.onRouteChange}
					/>
					{route === "home" ? (
						<div>
							<Logo />
							<Rank
								name={this.state.user.name}
								entries={this.state.user.entries}
							/>
							<ImageLinkForm
								onInputChange={this.onInputChange}
								onButtonSubmit={this.onButtonSubmit}
							/>
							<FaceRecognition box={box} imageUrl={imageUrl} />
						</div>
					) : route === "signin" ? (
						<Signin
							loadUser={this.loadUser}
							onRouteChange={this.onRouteChange}
						/>
					) : (
						<Register
							loadUser={this.loadUser}
							onRouteChange={this.onRouteChange}
						/>
					)}
				</div>
			</>
		);
	}
}

export default App;
