import "./Header.css";

const Header = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <img
        src="https://static.jaminproductions.com/assets/requests/request_a_song.jpg"
        className="request-a-song-image"
        alt="Request a song"
      />
      <div>
        <p className="header-title">{title}</p>
        <p className="header-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default Header;
