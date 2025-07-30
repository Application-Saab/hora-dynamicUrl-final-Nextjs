import styles from './EventInvite.css';

const EventInvite = ({ name, date, address, backgroundImage }) => {
  return (
    <div
      className="inviteContainer"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="inviteText">
        <h1 className="nameTxt">{name}</h1>
        <h1 className="dateTxt">{date}</h1>
        <p className="addTxt">{address}</p>
      </div>
    </div>
  );
};

export default EventInvite;
