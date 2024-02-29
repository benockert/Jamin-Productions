import "./Header.css";

const Header = ({ title, subtitle }) => {
  return (
    <div className="page-header">
      <img
        src={"/images/requests/request_a_song.jpg"}
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
