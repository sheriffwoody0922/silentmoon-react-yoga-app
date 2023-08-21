import "./Profile.css";
import { VideoDataContext } from "../../context/VideoDataContext";
import { useContext, useEffect, useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import Stats from "../../components/Stats/Stats";
import SearchBar from "../../components/Search/Search";
import RecommendedItem from "../../components/RecommendedItem/RecommendedItem";
import NavBar from "../../components/NavBar/NavBar";
import { MusicDataContext } from "../../context/MusicDataContext";
//import { UserDataContext } from "../../context/UserDataContext";
import LogoutBtn from "../../assets/img/Icons/logoutBtn.png";
import { UserContext } from "../../user/UserContext";

const Profile = () => {
  const { exerciseData } = useContext(VideoDataContext);
  const { playlistDetails } = useContext(MusicDataContext);
  const { userData } = useUserData();
  const storagedUserData = JSON.parse(
    sessionStorage.getItem("sessionedUserData")
  );
  const storagedExerciseData = JSON.parse(
    sessionStorage.getItem("sessionedExerciseData")
  );
  const storagedPlaylistDetails = JSON.parse(
    sessionStorage.getItem("sessionedPlaylistDetails")
  );
  const [searchInput, setSearchInput] = useState("");

  const favoriteExercises = exerciseData?.data || storagedExerciseData?.data;

  const { isLoggedIn, logout } = useContext(UserContext);

  const favoriteVideos = favoriteExercises?.filter((video) =>
    storagedUserData.videos.includes(video._id)
  );

  const favoritePlaylists = playlistDetails || storagedPlaylistDetails;

  return (
    <>
      {isLoggedIn && (
        <div className="main-wrapper">
          <div className="info-logout">
            <h1>{userData?.name || storagedUserData?.name}</h1>
            <button onClick={logout}>
              <img src={LogoutBtn} alt="logout button" />
            </button>
          </div>
          <SearchBar
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
          <Stats />
          <h2>Favourite Yoga Sessions</h2>
          <section className="slider">
            {favoriteVideos?.map((item) => (
              <RecommendedItem
                key={item._id}
                link={`/category/yoga/${item._id}`}
                image={item.image_url}
                title={item.title}
                level={item.level}
                duration={item.duration}
              />
            ))}
          </section>
          <h2>Favourite Meditations</h2>
          <section className="slider">
            {favoritePlaylists?.map((item) => (
              <RecommendedItem
                key={item.id}
                link={`/category/meditation/${item.id}`}
                title={
                  item.name.length > 20
                    ? `${item.name.substring(0, 10)}`
                    : item.name
                }
                playlist_id={item.id}
                image={item?.images[0].url}
                tracks={item?.tracks.total}
                owner={item?.owner.display_name}
              />
            ))}
          </section>
          <NavBar />
        </div>
      )}
    </>
  );
};

export default Profile;
