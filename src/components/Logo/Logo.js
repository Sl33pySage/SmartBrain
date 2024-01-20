import React from "react";
import Tilt from "react-parallax-tilt";
import brain from "./brain.png";
import "./Logo.css";

const Logo = () => {
	return (
		<Tilt
			className="Tilt br2 shadow-2"
			style={{ height: "150px", width: "150px" }}
		>
			<div className="ma4 mt0">
				<img
					style={{ paddingTop: "25px", height: "100px", width: "100px" }}
					src={brain}
					alt="logo"
				/>
			</div>
		</Tilt>
	);
};

export default Logo;
