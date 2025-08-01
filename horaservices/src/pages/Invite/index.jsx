import EventInvite from '@/components/EventInvite';

export default function Home() {
  const inviteData = {
    name: 'lakshya ',                      // Event's Name
    time: '11 PM',                     // Event's Time
    date: '10',                         // Date of the event
    month: ' August',                    // Month of the event
    address: '4th Floor, 5 & 10, Arakere Bannerghatta Rd, Syndicate Bank Colony, Omkar Nagar, Arekere, Bengaluru, Karnataka 560076', // Event's Address
  };

  return (
    <>
      <EventInvite
        name={inviteData.name}
        time={inviteData.time}
        date={inviteData.date}
        month={inviteData.month}
        address={inviteData.address}
      />
    </>
  );
}
