import Index from "@/pages/photography-page";
import { useRouter } from "next/router";
import "../../../../styles/homepage.css";



const PhotographyCityPage = () => {
  const router = useRouter();
  let { locality } = router.query;

  if (locality) {
    locality = locality.charAt(0).toUpperCase() + locality.slice(1);
  }


  return (
    <div >
  
      <Index  locality={locality}/>
    
    </div>
  );
};

export default PhotographyCityPage;

