import React, { useState, useEffect } from "react";
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { MessageCircle, Plus , ArrowDown , ArrowUp} from 'lucide-react';
import buynowImage from '../../../../../../assets/experts.png';
import buynowImage1 from '../../../../../../assets/secured.png';
import buynowImage2 from '../../../../../../assets/service.png';
import checkImage from '../../../../../../assets/tick.jpeg';
import { getDecorationProductOrganizationSchema , getProductFAQSchemaProductDetails} from "../../../../../../utils/schema";
import '../../../../../../css/decoration.css';
import { useSelector } from 'react-redux';
import { BASE_URL, GET_DECORATION_BY_NAME } from "@/utils/apiconstants";
import axios from 'axios';
import Head from 'next/head';
import  logo  from '../../../../../../assets/new_logo_light.png';
import { useRouter } from "next/router";
import Image from "next/image";
import faqData from '../../../../../../utils/faqData.json'
import Tabs from '../../../../../../components/Tabs';
import addOnProductsData from '../../../../../../utils/addOnProduct.json';
import DecorationCatDetails from "@/pages/balloon-decoration/[catValue]/product/[productName]";




function DecorationCityCatDetails() {
  return(
    <DecorationCatDetails />
  )
}
export default DecorationCityCatDetails;
