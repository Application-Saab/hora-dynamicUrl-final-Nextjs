import useApi from "@/hooks/useApi";
import { GET_ALL_EVENTS_BY_USERID } from "@/utils/apiconstants";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

const InvitesListing = ({ userId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading } = useApi(
    `${GET_ALL_EVENTS_BY_USERID}/${userId}`,
    "get"
  );
  const isWonderlandInternational = pathname?.startsWith(
    "/wonderlandinternational",
  );


  const formatDate = (dateString) => {
    if (!dateString) return "Event Date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const handleClickViewEvent = (eventData) => {
    if (isWonderlandInternational) {
      router.push(`/wonderlandinternational/invite?eventid=${eventData._id}`);
    } else {
      router.push(`/wonderland/invite?eventid=${eventData._id}`);
    }
  };

  return loading ? (
    <p>Loading your events...</p>
  ) : (
    <div className="event-list-wrapper">
      <h3 className="section-heading">Cheer Story</h3>
      <ul className="event-list">
        {data?.data?.map((event) => (
            <li key={event._id} className="event-item">
              <div className="event-info-list">
                <div className="event-details-list">
                  <div className="event-meta">
                    <span className="event-role">
                      {event.eventRole?.charAt(0).toUpperCase() +
                        event.eventRole?.slice(1)}
                    </span>
                  </div>
                  <span className="list-event-title">
                    {event.hostName ? `${event.hostName}` : "Host Name"}{" "}
                  </span>
                  <div className="list-event-date">
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                </div>
              </div>
              <div className="btn-ctn-event">
                <button
                  className="view-btn"
                  onClick={() => handleClickViewEvent(event)}
                >
                  View Event
                </button>
              </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default InvitesListing;
