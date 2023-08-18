import "./Home.css";
import { useContext, useEffect, useState } from "react";
import { VideoDataContext } from "../../context/VideoDataContext";
import { MusicDataContext } from "../../context/MusicDataContext";

import Logo from "../../components/Logo/Logo";
import { UserDataContext } from "../../context/UserDataContext";
import ExerciseSlider from "../../components/ExerciseSlider/ExerciseSlider";
import NavBar from "../../components/NavBar/NavBar";
import RandomHomeCardYoga from "../../components/RandomHomeCardYoga/RandomHomeCardYoga";
import ExerciseSliderMeditation from "../../components/ExerciseSliderMeditation/ExerciseSliderMeditation";

const Home = () => {
	const { exerciseData } = useContext(VideoDataContext);
	const { userData } = useContext(UserDataContext);
	const [greeting, setGreeting] = useState("");
	const { playlistData } = useContext(MusicDataContext);
	console.log("Playlists", playlistData?.data?.playlists?.items);

	// generate greeting
	let newGreeting = "";

	useEffect(() => {
		const currentHour = new Date().getHours();
		if (currentHour >= 5 && currentHour < 12) {
			newGreeting = "Good morning";
		} else if (currentHour >= 12 && currentHour < 18) {
			newGreeting = "Good afternoon";
		} else {
			newGreeting = "Good night";
		}

		setGreeting(newGreeting);
	}, []);
	// generate greeting end

	useEffect(() => {
		console.log(exerciseData.data);
	}, [exerciseData]);

	return (
		<div className='main-wrapper test'>
			<Logo className={"logo-black"} />
			<h2>
				{greeting} {userData?.name}
			</h2>
			<p>We hope you have a good day</p>
			<section className='suggestions'>
				<RandomHomeCardYoga data={exerciseData} category={"yoga"} />
				<RandomHomeCardYoga data={exerciseData} category={"yoga"} />
			</section>
			{/* Search Bar */}
			<h2>Recomended Yoga for you</h2>
			<ExerciseSlider data={exerciseData} category={"yoga"} />
			<h2>Recomended Meditation for you</h2>
			<ExerciseSliderMeditation
				data={playlistData?.data?.playlists?.items}
				category={"meditation"}
			/>
			<NavBar />
		</div>
	);
};

export default Home;
