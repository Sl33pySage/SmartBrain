import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./components/Navigation/Navigation";
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
		};
	}
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
			.then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
			.catch((error) => console.log("error:", error));
	};

	render() {
		return (
			<>
				<ParticlesBg type="cobweb" bg={true} />
				<div className="App">
					<Navigation />
					<Logo />
					<Rank />
					<ImageLinkForm
						onInputChange={this.onInputChange}
						onButtonSubmit={this.onButtonSubmit}
					/>
					<FaceRecognition
						box={this.state.box}
						imageUrl={this.state.imageUrl}
					/>
				</div>
			</>
		);
	}
}

export default App;
