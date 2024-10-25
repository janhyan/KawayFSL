import announcements from "../src/data/announcements";

export default function AnnouncementCard() {
    // LISTS THE ITEMS INSIDE
    let items = announcements.map((item) => {
      return (
        <li key={item.id}>
          {item.username}: {item.announcement}
        </li>
      );
    });
  
    return (
      <div className="announcement container card">
        <h2 className="announcement-text">Announcement</h2>
        <div className="announcement-content">
          <ul>{items}</ul>
        </div>
      </div>
    );
  }