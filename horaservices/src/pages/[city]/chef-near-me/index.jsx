import React, { useState, useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { useParams } from "react-router-dom";
import CreateOrder from "../book-chef-cook-for-party"
import bannerSvgImage from '../../../../public/assets/banner-home-bg.svg';
import bannerDecorationImage from '../../../assets/service-decoration.png';
import bannerChefImage from '../../../assets/chef-home-banner.png';
import bannerHospitalityImage from '../../../assets/hospitality.png';
import bannerReturnGiftImage from '../../../assets/return-gift-banner-home.png';
import bannerFoodDeliveryImage from '../../../assets/food-delivery-home-banner.png';
import Celebrate1Image from '../../../assets/Birthday&Celebration.png';
import Celebrate2Image from '../../../assets/corporate-party.png';
import Celebrate3Image from '../../../assets/house-party.png';
import Celebrate4Image from '../../../assets/wedding-event.png';
import Celebrate5Image from '../../../assets/gathering.png';
import Celebrate6Image from '../../../assets/kids-event.png';
import liveCateringImage from '../../../assets/live-buffet-service.png'
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const ChefCitypage = () => {
    const [showButton, setShowButton] = useState(false);
    const [city, setCity] = useState("");
    const openLink = () => {
        window.open("https://play.google.com/store/apps/details?id=com.hora", "_blank");
    };

    useEffect(() => {
        setShowButton(window.innerWidth > 800);
        function handleResize() {
            setShowButton(window.innerWidth > 800);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const cityData = {
        delhi: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList:
                [
                    { name: "Adarsh Nagar", },
                    { name: "adchini", },
                    { name: "Ajmeri Gate", },
                    { name: "akshardham", },
                    { name: "Alaknanda", },
                    { name: "Aman Vihar", },
                    { name: "Amar Colony", },
                    { name: "Ambedkar Nagar", },
                    { name: "Amrit Nagar", },
                    { name: "Amritpuri", },
                    { name: "Anand Lok", },
                    { name: "Anand Niketan" },
                    { name: "Anand Parbat" },
                    { name: "Anand Vihar" },
                    { name: "Andrews Ganj" },
                    { name: "Ansari Nagar East" },
                    { name: "Aradhna Enclave" },
                    { name: "Arjun Garh" },
                    { name: "Arjun Nagar" },
                    { name: "Arya Nagar" },
                    { name: "Ashok Nagar" },
                    { name: "Ashok Vihar" },
                    { name: "Ashoka Niketan" },
                    { name: "Ashram" },
                    { name: "Asiad Village" },
                    { name: "Asola" },
                    { name: "Aya Nagar" },
                    { name: "Azad Nagar" },
                    { name: "Azadpur" },
                    { name: "Badarpur" },
                    { name: "Batla house" },
                    { name: "Bawana" },
                    { name: "Bengali Market" },
                    { name: "Ber Sarai" },
                    { name: "Bhagya Vihar" },
                    { name: "Bhajanpura" },
                    { name: "Bhera Enclave" },
                    { name: "Bhikaji Cama Place" },
                    { name: "Budh Nagar" },
                    { name: "Chanakya Place" },
                    { name: "Chanakyapuri" },
                    { name: "Chander Nagar" },
                    { name: "Chandni Chowk" },
                    { name: "Chattarpur" },
                    { name: "Chawri Bazar" },
                    { name: "Chirag Delhi" },
                    { name: "Chirag Enclave" },
                    { name: "Chittaranjan Park" },
                    { name: "Civil Lines" },
                    { name: "Commonwealth Games Village" },
                    { name: "Connaught Place" },
                    { name: "CR Park" },
                    { name: "Dakshini Pitampura" },
                    { name: "Dakshinpuri" },
                    { name: "Darave" },
                    { name: "Daryaganj" },
                    { name: "Dayanand Colony" },
                    { name: "Dayanand Vihar" },
                    { name: "Defence Colony" },
                    { name: "Defence Enclave" },
                    { name: "Delhi Cantonment" },
                    { name: "Deoli" },
                    { name: "Dhansa" },
                    { name: "Dharampura" },
                    { name: "Dhaula Kuan" },
                    { name: "Dilshad Garden" },
                    { name: "Diplomatic Enclave" },
                    { name: "Dr Ambedkar Nagar" },
                    { name: "Dwarka" },
                    { name: "East Of Kailash" },
                    { name: "Fatehpuri" },
                    { name: "Freedom Fighter Enclave" },
                    { name: "Friends Colony" },
                    { name: "G T Karnal Road Industrial Area" },
                    { name: "Gagan Vihar" },
                    { name: "Gandhi Nagar" },
                    { name: "Gautam Nagar" },
                    { name: "Geeta Colony" },
                    { name: "Geetanjali Enclave" },
                    { name: "Ghaffar Manzil Colony" }

                ]
        },
        gurugram: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList: [
                { name: "Ardee city" },
                { name: "Arjun Nagar" },
                { name: "Ashok Vihar Phase I" },
                { name: "Badshapur" },
                { name: "Chakkarpur" },
                { name: "Dlf Phase 1" },
                { name: "Dlf Phase 2" },
                { name: "Dlf Phase 3" },
                { name: "Dlf Phase 4" },
                { name: "Dlf Phase 5" },
                { name: "Fazilpur" },
                { name: "Feroz Gandhi Colony" },
                { name: "Gandhi Nagar" },
                { name: "Garhi Harsaru" },
                { name: "Golf Course Extension" },
                { name: "Greenwood city" },
                { name: "Hans Enclave" },
                { name: "Hari Nagar" },
                { name: "Heera Nagar" },
                { name: "Islampur" },
                { name: "Jharsa" },
                { name: "Jyoti Park" },
                { name: "Kadipur" },
                { name: "Khandsa" },
                { name: "Krishna Colony" },
                { name: "Laxman Vihar" },
                { name: "Madan Puri" },
                { name: "Malibu Town" },
                { name: "Manesar Sector M1" },
                { name: "May Field Gardens" },
                { name: "MG road" },
                { name: "Model Town" },
                { name: "Mohyal Colony" },
                { name: "Nathupur" },
                { name: "New Basti" },
                { name: "New Colony" },
                { name: "New Palam Vihar" },
                { name: "Pace city" },
                { name: "Palam Vihar" },
                { name: "Pataudi Sector 1" },
                { name: "Patel Nagar" },
                { name: "Rajendra Park" },
                { name: "Rajiv Nagar" },
                { name: "Ram Nagar" },
                { name: "Ratan Vihar" },
                { name: "Ravi Nagar" },
                { name: "Rosewood city" },
                { name: "Sadar Bazar" },
                { name: "Saraswati Kunj" },
                { name: "Saraswati Vihar" },
                { name: "Sector 1" },
                { name: "Sector 10" },
                { name: "Sector 100" },
                { name: "Sector 101" },
                { name: "Sector 102" },
                { name: "Sector 103" },
                { name: "Sector 104" },
                { name: "Sector 105" },
                { name: "Sector 106" },
                { name: "Sector 107" },
                { name: "Sector 108" },
                { name: "Sector 109" },
                { name: "Sector 11" },
                { name: "Sector 110" },
                { name: "Sector 111" },
                { name: "Sector 112" },
                { name: "Sector 113" },
                { name: "Sector 114" },
                { name: "Sector 115" },
                { name: "Sector 12" },
                { name: "Sector 13" },
                { name: "Sector 14" },
                { name: "Sector 15 Part I" },
                { name: "Sector 16" },
                { name: "Sector 17" },
                { name: "Sector 18" },
                { name: "Sector 19" },
                { name: "Sector 2" },
                { name: "Sector 20" },
                { name: "Sector 21" },
                { name: "Sector 22" },
                { name: "Sector 23" },
                { name: "Sector 24" },
                { name: "Sector 25" },
                { name: "Sector 26" },
                { name: "Sector 27" },
                { name: "Sector 28" },
                { name: "Sector 29" },
                { name: "Sector 3" },
                { name: "Sector 30" },
                { name: "Sector 31" },
                { name: "Sector 32" },
                { name: "Sector 33" },
                { name: "Sector 34" },
                { name: "Sector 35" },
                { name: "Sector 36" },
                { name: "Sector 37 Part I Industrial" },
                { name: "Sector 38" },
                { name: "Sector 39" },
                { name: "Sector 4" },
                { name: "Sector 41" },
                { name: "Sector 42" },
                { name: "Sector 43" },
                { name: "Sector 44" },
                { name: "Sector 45" },
                { name: "Sector 46" },
                { name: "Sector 47" },
                { name: "Sector 48" },
                { name: "Sector 49" },
                { name: "Sector 5" },
                { name: "Sector 50" },
                { name: "Sector 51" },
                { name: "Sector 52" },
                { name: "Sector 53" },
                { name: "Sector 54" },
                { name: "Sector 55" },
                { name: "Sector 56" },
                { name: "Sector 57" },
                { name: "Sector 58" },
                { name: "Sector 59" }
            ]
        },
        Ghaziabad: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList: [
                { "name": "Abhay Khand" },
                { "name": "Ahinsa Khand" },
                { "name": "Amrit Nagar" },
                { "name": "Ankur Vihar" },
                { "name": "Avantika" },
                { "name": "Baghpat" },
                { "name": "Bamheta" },
                { "name": "Behta Colony" },
                { "name": "Behta Hazipur" },
                { "name": "Bhim Nagar" },
                { "name": "Bhopura" },
                { "name": "Bhram Puri" },
                { "name": "Bhuapur" },
                { "name": "Brij Vihar" },
                { "name": "Budh Vihar" },
                { "name": "Chander Nagar" },
                { "name": "Chhapraula" },
                { "name": "Chipiyana Buzurg" },
                { "name": "Chiranjiv Vihar" },
                { "name": "Crossings Republik" },
                { "name": "Dadri" },
                { "name": "Dasna" },
                { "name": "Daulatpur" },
                { "name": "Defence Colony" },
                { "name": "Dilshad Garden" },
                { "name": "Duhai" },
                { "name": "Dundahera" },
                { "name": "Gagan Vihar" },
                { "name": "Gandhi Nagar" },
                { "name": "Ganeshpuri" },
                { "name": "Garhmukteshwar" },
                { "name": "Ghantaghar" },
                { "name": "Ghukna" },
                { "name": "Govindpuram" },
                { "name": "Gulab Vatika" },
                { "name": "Gyan Khand" },
                { "name": "Hapur" },
                { "name": "Hindan Residential Area" },
                { "name": "Indirapuram" },
                { "name": "Indraprastha" },
                { "name": "Jassipur" },
                { "name": "Jawahar Nagar" },
                { "name": "Judges Enclave" },
                { "name": "Kamla Nehru Nagar" },
                { "name": "Kaushambhi" },
                { "name": "Kavi Nagar" },
                { "name": "Kavi Nagar Industrial Area" },
                { "name": "Kot Gaon" },
                { "name": "Krishna Vihar" },
                { "name": "Lohia Nagar" },
                { "name": "Loni" },
                { "name": "Loni Industrial Area" },
                { "name": "Madhopura" },
                { "name": "Mahurali" },
                { "name": "Maliwara" },
                { "name": "Marium Nagar" },
                { "name": "Masuri" },
                { "name": "Meerut Road Industrial Area" },
                { "name": "Mirzapur" },
                { "name": "Model Town" },
                { "name": "Modi Nagar" },
                { "name": "Mohan Meakin Industrial Estate" },
                { "name": "Mohan Nagar" },
                { "name": "Morta" },
                { "name": "Morti" },
                { "name": "Murad Nagar" },
                { "name": "Nai Basti Dundahera" },
                { "name": "Nandgram" },
                { "name": "Nasbandi Colony" },
                { "name": "Naya Ganj" },
                { "name": "Neelmani Colony" },
                { "name": "Nehru Nagar" },
                { "name": "New Vijay Nagar" },
                { "name": "NH 24" },
                { "name": "Niti Khand I" },
                { "name": "Niti Khand-Indirapuram" },
                { "name": "Nyay Khand I" },
                { "name": "Pandav Nagar" },
                { "name": "Pasaunda" },
                { "name": "Patel Nagar I" }
            ]
        },
        Faridabad: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList: [
                { "name": "Adarsh Colony" },
                { "name": "Agwanpur" },
                { "name": "Ajit Nagar" },
                { "name": "Ajronda" },
                { "name": "ALL SECTORS" },
                { "name": "Amru" },
                { "name": "Anangpur" },
                { "name": "Ankhir" },
                { "name": "Aravali" },
                { "name": "Aravali Vihar" },
                { "name": "Arya Nagar" },
                { "name": "Ashoka Enclave" },
                { "name": "Badarpur Border" },
                { "name": "Badkhal" },
                { "name": "Ballabhgarh" },
                { "name": "Barauli" },
                { "name": "Basantpur" },
                { "name": "Basilva Colony" },
                { "name": "Bhatia Colony" },
                { "name": "Bhoor Colony" },
                { "name": "Bhopani" },
                { "name": "Camp Market" },
                { "name": "Chandpur" },
                { "name": "Charmwood Village" },
                { "name": "Chawla Colony" },
                { "name": "Dabua Colony" },
                { "name": "Dayal Bagh" },
                { "name": "Dayal Basti" },
                { "name": "Dayalpur" },
                { "name": "Dhauj" },
                { "name": "Dher Colony" },
                { "name": "DLF Industrial Area" },
                { "name": "Faridpur" },
                { "name": "Friends Colony" },
                { "name": "Frontier Colony" },
                { "name": "Fruit Garden" },
                { "name": "Hodal" },
                { "name": "Housing Board colony" },
                { "name": "HUDA Sector 2" },
                { "name": "Indira Gandhi Colony" },
                { "name": "Indraprastha Colony" },
                { "name": "Jasna" },
                { "name": "Jawahar Colony" },
                { "name": "Jeevan Nagar" },
                { "name": "Jiwan Nagar" },
                { "name": "Kabulpur Bangar" },
                { "name": "Kanoongo Maholla" },
                { "name": "Kant Enclave" },
                { "name": "Kanungo Maholla" },
                { "name": "Kanwara" },
                { "name": "Kapra Colony" },
                { "name": "Karna" },
                { "name": "Katan Pahari" },
                { "name": "Krishna Colony" },
                { "name": "Lakewood city" },
                { "name": "Lakkarpur" },
                { "name": "Lane Pura" },
                { "name": "Lohagrah" },
                { "name": "Manjhawali" },
                { "name": "Mewla Maharajpur" },
                { "name": "Mohan Nagar" },
                { "name": "Moti Colony" },
                { "name": "Mujesar" },
                { "name": "Neelam Bata Colony" },
                { "name": "Neharpar" },
                { "name": "Nehru Colony" },
                { "name": "New Baselwa Colony" },
                { "name": "New Colony" },
                { "name": "Old Faridabad" },
                { "name": "Pali Village" },
                { "name": "Panchwati Colony" },
                { "name": "Panna Vihar" },
                { "name": "Piyala" },
                { "name": "Prakash Vihar" },
                { "name": "Prithla" },
                { "name": "Railway Colony" },
                { "name": "Rajeev Nagar" },
                { "name": "Rajiv Nagar" },
                { "name": "Rajpur Kalan" },
                { "name": "Ram Nagar" }
                // Add more localities here
            ]

        },
        Noida: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList: [
                { "name": "Ambedkar city" },
                { "name": "Baraula" },
                { "name": "Bhangel" },
                { "name": "Hajipur" },
                { "name": "Indirapuram" },
                { "name": "Mamura" },
                { "name": "Noida Extension" },
                { "name": "Parthala Khanjarpur" },
                { "name": "Sarfbad" },
                { "name": "Sector 1" },
                { "name": "Sector 10" },
                { "name": "Sector 100" },
                { "name": "Sector 101" },
                { "name": "Sector 102" },
                { "name": "Sector 103" },
                { "name": "Sector 104" },
                { "name": "Sector 105" },
                { "name": "Sector 106" },
                { "name": "Sector 107" },
                { "name": "Sector 108" },
                { "name": "Sector 109" },
                { "name": "Sector 110" },
                { "name": "Sector 111" },
                { "name": "Sector 112" },
                { "name": "Sector 113" },
                { "name": "Sector 114" },
                { "name": "Sector 115" },
                { "name": "Sector 116" },
                { "name": "Sector 117" },
                { "name": "Sector 118" },
                { "name": "Sector 119" },
                { "name": "Sector 12" },
                { "name": "Sector 120" },
                { "name": "Sector 121" },
                { "name": "Sector 122" },
                { "name": "Sector 123" },
                { "name": "Sector 124" },
                { "name": "Sector 125" },
                { "name": "Sector 126" },
                { "name": "Sector 127" },
                { "name": "Sector 128" },
                { "name": "Sector 129" },
                { "name": "Sector 130" },
                { "name": "Sector 131" },
                { "name": "Sector 132" },
                { "name": "Sector 133" },
                { "name": "Sector 134" },
                { "name": "Sector 135" },
                { "name": "Sector 136" },
                { "name": "Sector 137" },
                { "name": "Sector 138" },
                { "name": "Sector 139" },
                { "name": "Sector 14" },
                { "name": "Sector 140" },
                { "name": "Sector 141" },
                { "name": "Sector 142" },
                { "name": "Sector 143" },
                { "name": "Sector 144" },
                { "name": "Sector 145" },
                { "name": "Sector 146" },
                { "name": "Sector 147" },
                { "name": "Sector 148" },
                { "name": "Sector 149" },
                { "name": "Sector 15" },
                { "name": "Sector 150" },
                { "name": "Sector 151" },
                { "name": "Sector 152" },
                { "name": "Sector 153" },
                { "name": "Sector 154" },
                { "name": "Sector 155" },
                { "name": "Sector 156" },
                { "name": "Sector 157" },
                { "name": "Sector 158" },
                { "name": "Sector 159" },
                { "name": "Sector 16" },
                { "name": "Sector 160" },
                { "name": "Sector 161" },
                { "name": "Sector 162" },
                { "name": "Sector 163" },
                { "name": "Sector 164" }
                // Add more localities here
            ]

        },
        Bengaluru: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList:
                [
                    { "name": "A Narayanapura" },
                    { "name": "Akshya Nagar" },
                    { "name": "Allalasandra" },
                    { "name": "Ambalipura" },
                    { "name": "Anagalapura" },
                    { "name": "Anand Nagar" },
                    { "name": "Azad Nagar" },
                    { "name": "B Narayanapura" },
                    { "name": "Babusapalaya" },
                    { "name": "Bagalakunte" },
                    { "name": "Bagalur" },
                    { "name": "Bagaluru" },
                    { "name": "Bagepalli" },
                    { "name": "Baiyappanahalli" },
                    { "name": "Balagere" },
                    { "name": "Balaji Nagar" },
                    { "name": "Baliganapalli" },
                    { "name": "Banashankari" },
                    { "name": "Banaswadi" },
                    { "name": "Banjara Layout" },
                    { "name": "Bank Avenue Colony" },
                    { "name": "Bannerghatta" },
                    { "name": "Bapuji Nagar" },
                    { "name": "Basapura" },
                    { "name": "Basavanagar" },
                    { "name": "Basavanagudi" },
                    { "name": "Basavanna Nagar" },
                    { "name": "Basaveshwara Nagar" },
                    { "name": "Battarahalli" },
                    { "name": "Begur" },
                    { "name": "Belathur" },
                    { "name": "Bellahalli" },
                    { "name": "Bellandur" },
                    { "name": "Bennigana Halli" },
                    { "name": "Benson Town" },
                    { "name": "Bettahalasur" },
                    { "name": "Bhoganhalli" },
                    { "name": "Bhoopasandra" },
                    { "name": "Bidadi" },
                    { "name": "Bidrahalli" },
                    { "name": "Bikkanahalli" },
                    { "name": "Bilekahalli" },
                    { "name": "Bommanahalli" },
                    { "name": "Bommasandra" },
                    { "name": "Bommenahalli" },
                    { "name": "Brookefield" },
                    { "name": "BTM Layout" },
                    { "name": "Budigere" },
                    { "name": "Budigere Cross" },
                    { "name": "Byatarayanapura" },
                    { "name": "Cambridge Layout" },
                    { "name": "Carmelaram" },
                    { "name": "Challaghatta" },
                    { "name": "Chamarajpet" },
                    { "name": "Channasandra" },
                    { "name": "Cheemasandra" },
                    { "name": "Chickpet" },
                    { "name": "Chikballapur" },
                    { "name": "Chikbanavara" },
                    { "name": "Chikka Tirupathi" },
                    { "name": "Chikkaballapur" },
                    { "name": "Chikkabanavara" },
                    { "name": "Chikkabidarakallu" },
                    { "name": "Chikkalasandra" },
                    { "name": "Chikkanagamangala" },
                    { "name": "Chikkanahalli" },
                    { "name": "Chikkasandra" },
                    { "name": "Chinnapanahalli" },
                    { "name": "Chintamani" },
                    { "name": "Choodasandra" },
                    { "name": "Cooke Town" },
                    { "name": "Cottonpet" },
                    { "name": "Cox Town" },
                    { "name": "Cubbon Park" },
                    { "name": "CV Raman Nagar" },
                    { "name": "Dabaspete" },
                    { "name": "Dasarahalli" },
                    { "name": "Dayananda Nagar" },
                    { "name": "Deepanjali Nagar" },
                    { "name": "Defence Colony" }
                    // Add more localities here
                ]
        },
        Hyderabad: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList:
                [
                    { "name": "Aghapura" },
                    { "name": "Ahmed Nagar" },
                    { "name": "Aliabad" },
                    { "name": "Ambedkar Nagar" },
                    { "name": "Amber Nagar" },
                    { "name": "Ameenpur" },
                    { "name": "Ameerpet" },
                    { "name": "Aminpur" },
                    { "name": "Asif Nagar" },
                    { "name": "Azamabad" },
                    { "name": "Baber Bagh" },
                    { "name": "Badangpet" },
                    { "name": "Badi Chowdi" },
                    { "name": "Bagh Amberpet" },
                    { "name": "Bahadurpally" },
                    { "name": "Bahadurpura" },
                    { "name": "Balamrai" },
                    { "name": "Balanagar" },
                    { "name": "Balapur" },
                    { "name": "Bandimet" },
                    { "name": "Bandlaguda" },
                    { "name": "Banjara Hills" },
                    { "name": "Bapuji Nagar" },
                    { "name": "Barkatpura" },
                    { "name": "Basheer Bagh" },
                    { "name": "Beeramguda" },
                    { "name": "Begum Bazaar" },
                    { "name": "Begumpet" },
                    { "name": "Bhagya Nagar Colony" },
                    { "name": "Bharat Nagar" },
                    { "name": "Bholakpur" },
                    { "name": "Bhuvanagiri" },
                    { "name": "Bibinagar" },
                    { "name": "BN Reddy Nagar" },
                    { "name": "Boiguda" },
                    { "name": "Bolarum" },
                    { "name": "Borabanda" },
                    { "name": "Bowenpally" },
                    { "name": "Bowrampet" },
                    { "name": "Brahim Patnam" },
                    { "name": "Buddha Nagar" },
                    { "name": "Chanda Nagar" },
                    { "name": "Chandulal Baradari" },
                    { "name": "Charlapally" },
                    { "name": "Charminar" },
                    { "name": "Chatta Bazar" },
                    { "name": "Cherlapally" },
                    { "name": "Chevalla" },
                    { "name": "Chikkadpally" },
                    { "name": "Chintal Basti" },
                    { "name": "Chintapallyguda" },
                    { "name": "Cyberabad" },
                    { "name": "Dabeerpura North" },
                    { "name": "Dammaiguda" },
                    { "name": "Darul Shifa" },
                    { "name": "Darus Salam" },
                    { "name": "Dasarlapally" },
                    { "name": "Dattatreya Colony" },
                    { "name": "Devan Devdi" },
                    { "name": "Dhoolpet" },
                    { "name": "Dilshad Nagar" },
                    { "name": "Dilsukh Nagar" },
                    { "name": "Dundigal" },
                    { "name": "Dwarkapuri Colony" },
                    { "name": "East Marredpally" },
                    { "name": "Falaknuma" },
                    { "name": "Farooqnagar" },
                    { "name": "Fateh Maidan" },
                    { "name": "Fateh Nagar" },
                    { "name": "Feelkhana" },
                    { "name": "Film Nagar" },
                    { "name": "Financial District" },
                    { "name": "Gachibowli" },
                    { "name": "Gagan Mahal" },
                    { "name": "Gandhi Bhavan" },
                    { "name": "Gandhi Nagar" },
                    { "name": "Gandipet" },
                    { "name": "Ghasmandi" },
                    { "name": "Ghatkesar" },
                    { "name": "Golconda" }
                    // Add more localities here
                ]

        },
        Mumbai: {
            bannerImage: "OIP1.jpg",
            cityLocalitiesList:
                [
                    { "name": "Aarey Milk Colony" },
                    { "name": "Abhyudaya Nagar" },
                    { "name": "Adharwadi" },
                    { "name": "Agripada" },
                    { "name": "Airport Area" },
                    { "name": "Akurli Nagar" },
                    { "name": "Alibag" },
                    { "name": "Ambarnath" },
                    { "name": "Ambedkar Nagar" },
                    { "name": "Ambewadi" },
                    { "name": "Ambivali" },
                    { "name": "Amboli" },
                    { "name": "Anand Nagar" },
                    { "name": "Antop Hill" },
                    { "name": "Apollo Bunder" },
                    { "name": "Asangaon" },
                    { "name": "Asha Nagar" },
                    { "name": "August Kranti Maidan" },
                    { "name": "Azad Nagar" },
                    { "name": "Badlapur" },
                    { "name": "Balkum" },
                    { "name": "Ballard Estate" },
                    { "name": "Bandra East" },
                    { "name": "Bandra Kurla Complex" },
                    { "name": "Bandra West" },
                    { "name": "Bangur Nagar" },
                    { "name": "Bazargate" },
                    { "name": "Behram Baug" },
                    { "name": "Beverly Park" },
                    { "name": "Bhakti Park" },
                    { "name": "Bhandup" },
                    { "name": "Bharat Nagar" },
                    { "name": "Bhayandar" },
                    { "name": "Bhiwandi" },
                    { "name": "Bhuleshwar" },
                    { "name": "BN Bhavan" },
                    { "name": "Boisar" },
                    { "name": "Bolinj" },
                    { "name": "Borivali" },
                    { "name": "BPT Colony" },
                    { "name": "Brahmand" },
                    { "name": "Breach Candy" },
                    { "name": "Byculla" },
                    { "name": "CGS Colony" },
                    { "name": "Chakala" },
                    { "name": "Chamar Baug" },
                    { "name": "Chandan Shanti" },
                    { "name": "Chandivali" },
                    { "name": "Charai" },
                    { "name": "Charkop" },
                    { "name": "Chembur" },
                    { "name": "Chikholi" },
                    { "name": "Chikuwadi" },
                    { "name": "Chinch Bandar" },
                    { "name": "Chincholi Bunder" },
                    { "name": "Chinchpokli" },
                    { "name": "Chiplun" },
                    { "name": "Chira Bazaar" },
                    { "name": "Chowk" },
                    { "name": "Chowpatty" },
                    { "name": "Chuna Bhatti" },
                    { "name": "Churchgate" },
                    { "name": "Colaba" },
                    { "name": "Cotton Green" },
                    { "name": "Cotton Green West" },
                    { "name": "CP Tank" },
                    { "name": "Crawford Market" },
                    { "name": "CST Area" },
                    { "name": "Cuffe Parade" },
                    { "name": "Dadar" },
                    { "name": "Dahisar" },
                    { "name": "Dahivali" },
                    { "name": "Dana Bunder" },
                    { "name": "Danda" },
                    { "name": "Dattapada" },
                    { "name": "Deonar" },
                    { "name": "Devdaya Nagar" },
                    { "name": "Dharavi" },
                    { "name": "Dhobi Ali" },
                    { "name": "Dhobi Talao" },
                    { "name": "Dhokali" },
                    { "name": "Dindoshi" },
                    { "name": "Dockyard" },
                    { "name": "Dombivali" },
                    { "name": "Dongri" },
                    { "name": "Dronagiri" },
                    { "name": "Eden Wood" },
                    { "name": "Eksar" },
                    { "name": "Ekvira Darshan" },
                    { "name": "Evershine Nagar" },
                    { "name": "Flora Fountain" },
                    { "name": "Fort" },
                    { "name": "Four Bungalows" },
                    { "name": "Gamdevi" },
                    { "name": "Gandhi Nagar" },
                    { "name": "Gauripada" },
                    { "name": "Gawand Baug" },
                    { "name": "Ghati Pada" },
                    { "name": "Ghatkopar" },
                    { "name": "Girgaon" },
                    { "name": "Girgaum" },
                    { "name": "Gokul Township" },
                    { "name": "Gokuldham" },
                    { "name": "Gorai" },
                    { "name": "Goregaon" },
                    { "name": "Govandi" },
                    { "name": "Government Colony" },
                    { "name": "Gowalia Tank" },
                    { "name": "Grant Road East" },
                    { "name": "Green Park Extension" },
                    { "name": "GTB Nagar" },
                    { "name": "Gulalwadi" },
                    { "name": "Haji Ali" },
                    { "name": "Hanuman Nagar" },
                    { "name": "Hatkesh Udhog Nagar" },
                    { "name": "Horiman Circle" },
                    { "name": "Hutatma Chowk" },
                    { "name": "Huzefa Nagar" },
                    { "name": "IC Colony" },
                    { "name": "Industrial Area" }
                ]

        },
        Indore: {
            bannerImage: "OIP1.jpg",
        },
        Chennai: {
            bannerImage: "OIP1.jpg",
        },
        Pune: {
            bannerImage: "OIP1.jpg",
        },
        Surat: {
            bannerImage: "OIP1.jpg",
        },
        Bhopal: {
            bannerImage: "OIP1.jpg",
        },
        kolkata: {
            bannerImage: "OIP1.jpg",
        },
        Kanpur: {
            bannerImage: "OIP1.jpg",
        },
        Lucknow: {
            bannerImage: "OIP1.jpg",
        },
        Goa: {
            bannerImage: "OIP1.jpg",
        },
        Jaipur: {
            bannerImage: "OIP1.jpg",
        },
        Ahmedabad: {
            bannerImage: "OIP1.jpg",
        },
        Chandigarh: {
            bannerImage: "OIP1.jpg",
        }
    };
    const router = useRouter();
    // const  city  = router.query.city;
    // const city = router.asPath.split('/')[1];

    useEffect(() => {
        if (router.isReady) {
            const { city } = router.query;
            setCity(city);
        }
    }, [router.isReady, router.query]);

    if (!router.isReady) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <Head>
  <title>
    {city
      ? `HORA Chef Services in ${city} | Hire Private Chef & Cook for Parties, Events & Home – Book Now`
      : `HORA Chef Services | Hire Private Chef & Cook for Parties, Events & Home – Book Now`}
  </title>

  <meta
    name="description"
    content={
      city
        ? `🍽️ Book a Professional Chef in ${city}! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more. Starting at affordable prices.`
        : `🍽️ Book a Professional Chef Near You! ✨ HORA Chef Services — Hire trained & verified private chefs and cooks for birthdays, house parties, weddings, corporate events & more.`
    }
  />

  <meta
    name="keywords"
    content={
      city
        ? `hire chef in ${city}, book a cook in ${city}, private chef ${city}, personal chef ${city}, chef for party ${city}, catering services ${city}, home chef ${city}, cook near me ${city}`
        : `hire chef, book a cook, private chef, personal chef, chef for party, catering services, home chef, cook near me`
    }
  />

  <meta
    property="og:title"
    content={
      city
        ? `Hire Professional Chef & Cook in ${city} | HORA Chef Services`
        : `Hire Professional Chef & Cook | HORA Chef Services`
    }
  />
  <meta
    property="og:description"
    content="🍽️ Explore a wide range of professional chef and cook services for every event and party. Book your ideal chef directly through our website for a seamless experience. Need help? Contact us at 7338584828."
  />
  <meta property="og:image" content="https://horaservices.com/api/uploads/attachment-1706520980436.png" />
  <meta property="og:image:alt" content="hire chef, private chef, cook for party, catering services, home chef" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Hora Services" />
  <link rel="icon" href="https://horaservices.com/api/uploads/logo-icon.png" type="image/x-icon" />
  <meta
    property="og:url"
    content={
      city
        ? `https://horaservices.com/${city.toLowerCase()}/book-chef-cook-for-party`
        : `https://horaservices.com/book-chef-cook-for-party`
    }
  />
  <meta property="og:type" content="website" />
</Head>
        <div>
           
            <CreateOrder/>
           

          
            <section id="section6" class="sectionidsec">
                <div style={styles.pageWidth}>
                    <div id="faqQ">
                        <div>
                            <h1 style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 0px", textAlign: "center" }}>Faq</h1>
                        </div>
                        <div>
                            <strong>1: How can I hire an online chef for my event in {city.toUpperCase()}?</strong>
                            <p>A: Hiring an online chef in {city.toUpperCase()} is easy!</p>
                            <p>A: Visit our website or download our app and place the order by selecting your dish, number of people, date, and time of the event to secure their services for your event.</p>
                        </div>
                        <div>
                            <strong>2: What makes your catering services the best for small parties in {city.toUpperCase()}?</strong>
                            <p>A: Our catering services in {city.toUpperCase()} are tailored for small parties , We offer personalized options to make your event unforgettable.</p>
                        </div>
                        <div>
                            <strong>3: Can I book a private chef for a day or night in {city.toUpperCase()}?</strong>
                            <p>A: Absolutely! Our private chefs are available for hire in {city.toUpperCase()}, ensuring a unique dining experience for any occasion.</p>
                        </div>
                        <div>
                            <strong>4: How do I find a trained verified cook near me in {city.toUpperCase()}?</strong>
                            <p>A: Finding a trained verified cook near you is simple. Enter your location on our platform, and choose from a list of dishes, number of people, date and time of event.</p>
                        </div>
                        <div>
                            <strong>5: Is Book a cook in {city.toUpperCase()} suitable for last-minute chef bookings?</strong>
                            <p>A: Yes, our platform allows for convenient and quick bookings, you can book the order 24 hours in advance.</p>
                        </div>
                        <div>
                            <strong>6: What sets your chefs for hire in {city.toUpperCase()} apart from others?</strong>
                            <p>A: Our chefs in {city.toUpperCase()} are not only skilled but also verified, ensuring a high standard of service and culinary expertise.</p>
                        </div>
                        <div>
                            <strong>7: Can I hire a cook at home for a special occasion in {city.toUpperCase()}?</strong>
                            <p>A: Certainly! Explore our selection of cooks available for hire at home in {city.toUpperCase()} to make your event memorable.</p>
                        </div>
                        <div>
                            <strong>8: How do I take a chef in {city.toUpperCase()} for a personalized cooking experience?</strong>
                            <p>A: Taking a chef in {city.toUpperCase()} is simple. Choose a chef, specify your preferences, and enjoy a personalized cooking experience in the comfort of your home.</p>
                        </div>
                        <div>
                            <strong>9: Are your party caterers in {city.toUpperCase()} suitable for both small and large events?</strong>
                            <p>A: Yes, our party caterers in {city.toUpperCase()} cater to a variety of events, from intimate gatherings to larger celebrations.</p>
                        </div>
                        <div>
                            <strong>10: Can I hire a professional chef for a night in {city.toUpperCase()}?</strong>
                            <p>A: Absolutely! Explore our options to hire a professional chef for a night in {city.toUpperCase()} and create a culinary experience to remember.</p>
                        </div>
                        <div>
                            <strong>11: Is it possible to hire someone to cook for me in {city.toUpperCase()} regularly?</strong>
                            <p>A: Yes, you can hire a cook near you in {city.toUpperCase()} for regular cooking services. Choose a cook that fits your preferences and schedule.</p>
                        </div>
                        <div>
                            <strong>12: What is the process for hiring a private personal chef in {city.toUpperCase()}?</strong>
                            <p>A: Hiring a private personal chef is easy. Browse through our profiles, select your preferred chef, and book their services for a personalized culinary experience.</p>
                        </div>
                        <div>
                            <strong>13: : How can I find the best home caterers in {city.toUpperCase()}?</strong>
                            <p>A: Finding the best home caterers in {city.toUpperCase()} is simple with our platform. Explore our options and choose the one that suits your needs.</p>
                        </div>
                        <div>
                            <strong>14: Do you have top-rated cooks in {city.toUpperCase()} available for hire?</strong>
                            <p>A: Yes, we have a selection of top-rated cooks in {city.toUpperCase()} available for hire. Explore their profiles and book the one that meets your requirements.</p>
                        </div>
                        <div>
                            <strong>15: Can I hire a chef at home in {city.toUpperCase()} for a cooking demonstration?</strong>
                            <p>A: Absolutely! Hire a chef at home in {city.toUpperCase()} for a cooking demonstration and learn culinary skills from a professional.</p>
                        </div>
                        <div>
                            <strong>16: What is the difference between a private chef and a personal cook in {city.toUpperCase()}?</strong>
                            <p>A: A private chef typically offers a more personalized and upscale dining experience, while a personal cook provides regular cooking services. Choose based on your specific needs.</p>
                        </div>
                        <div>
                            <strong>17: Can I hire cooks on demand in {city.toUpperCase()} for last-minute gatherings?</strong>
                            <p>A: Yes, our platform allows you to hire cooks on demand in {city.toUpperCase()}, making it convenient for spontaneous events.</p>
                        </div>
                        <div>
                            <strong>18: How can I find local chefs for hire in {city.toUpperCase()} for a regional cuisine?</strong>
                            <p>A: Finding local chefs for hire in {city.toUpperCase()} is easy. Specify your cuisine preferences, and our platform will display chefs with expertise in that cuisine.</p>
                        </div>
                        <div>
                            <strong>19: Are there cooking maids near me in {city.toUpperCase()} available for hire?</strong>
                            <p>A: Yes, you can find cooking maids near you in {city.toUpperCase()} available for hire. Explore their profiles and choose the one that suits your needs.</p>
                        </div>
                        <div>
                            <strong>20: Can I hire a personal chef for a night in {city.toUpperCase()} for a romantic dinner?</strong>
                            <p>A: Certainly! Hire a personal chef for a night in {city.toUpperCase()} and create a romantic dining experience in the comfort of your home</p>
                        </div>
                        <div>
                            <strong>21: How do I hire a cook online in {city.toUpperCase()} for virtual cooking sessions?</strong>
                            <p>A: Hiring a cook online in {city.toUpperCase()} for virtual cooking sessions is simple. Browse through available cooks, choose one, and arrange for an online cooking session.</p>
                        </div>
                        <div>
                            <strong>22: : What makes your home cooking service in {city.toUpperCase()} unique?</strong>
                            <p>A: Our home cooking service in {city.toUpperCase()} is unique due to our diverse selection of trained and verified cooks, ensuring a high-quality culinary experience</p>
                        </div>
                        <div>
                            <strong>23: Can I book mini caterers in {city.toUpperCase()} for a small family gathering?</strong>
                            <p>A: Absolutely! Our mini caterers in {city.toUpperCase()} are perfect for small family gatherings, providing a customized and delightful culinary experience.</p>
                        </div>
                        <div>
                            <strong>24: How do I hire a private cook for home in {city.toUpperCase()} for regular meals?</strong>
                            <p>A: Hiring a private cook for home in {city.toUpperCase()} for regular meals is easy. Choose a cook that fits your preferences and schedule for consistent cooking services.</p>
                        </div>
                        <div>
                            <strong>25: Are your private chef services near me in {city.toUpperCase()} available for special dietary requirements?</strong>
                            <p>A: Yes, our private chef services near you in {city.toUpperCase()} are customizable to accommodate special dietary requirements. Discuss your needs with the selected chef to ensure a tailored culinary experience.</p>
                        </div>
                    </div>
                    <p id="city-area-title" style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 2px", textAlign: "center" }}>Serving all Areas in {city}</p>
                    <p style={{ fontSize: "10px", fontWeight: "bold", color: "#E6756B", margin: "2px 0 2px", textAlign: "center" }}>All localities are here</p>
                    <div id="city-area-list" style={{ width: "150px", alignItems: "center", margin: "auto" }}>
                        <ul style={{ listStyle: "none", padding: "20px 0", textAlign: "center" }}>

                            {cityData[city]?.cityLocalitiesList?.length > 0 ? (
                                cityData[city].cityLocalitiesList.map((item, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: "0 10px",
                                            display: "inline-block",
                                        }}
                                    >
                                        <a href="/">{item.name}</a>
                                    </li>
                                ))
                            ) : (
                                <li>No localities found for {city}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </section>
            <section id="section7" class="sectionidsec">
                <div style={styles.pageWidth}>
                    <p style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 2px", textAlign: "center" }} className="other-cities">Other Cities</p>
                    <div class="tab-inner">
                        <ul style={{ listStyle: "none", padding: "20px 20px" }}>
                            <li className="city-link" data-city="Delhi" style={{ padding: "0 10px", display: "inline-block" }} >
                                <Link href="#">Delhi</Link>
                            </li>
                            <li className="city-link" data-city="Gurugram" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Gurugram</Link>
                            </li>
                            <li className="city-link" data-city="Ghaziabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Ghaziabad</Link>
                            </li>
                            <li className="city-link" data-city="Faridabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Faridabad</Link>
                            </li>
                            <li className="city-link" data-city="Noida" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Noida</Link>
                            </li>
                            <li className="city-link" data-city="Bengaluru" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Bengaluru</Link>
                            </li>
                            <li className="city-link" data-city="Bangalore" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Bangalore</Link>
                            </li>
                            <li className="city-link" data-city="Hyderabad" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Hyderabad</Link>
                            </li>
                            <li className="city-link" data-city="Mumbai" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Mumbai</Link>
                            </li>
                            <li className="city-link" data-city="Indore" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Indore</Link>
                            </li>
                            <li className="city-link" data-city="Chennai" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#">Chennai</Link>
                            </li>
                            <li className="city-link" data-city="Pune" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Pune</Link>
                            </li>
                            <li className="city-link" data-city="Surat" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Surat</Link>
                            </li>
                            <li className="city-link" data-city="Bhopal" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Bhopal</Link>
                            </li>
                            <li className="city-link" data-city="kanpur" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Kanpur</Link>
                            </li>
                            <li className="city-link" data-city="Lucknow" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Lucknow</Link>
                            </li>
                            <li className="city-link" data-city="kolkata" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Kolkata</Link>
                            </li>
                            <li className="city-link" data-city="Goa" style={{ padding: "0 10px", display: "inline-block" }}>
                                <Link href="#" >Goa</Link>
                            </li>
                        </ul>

                        <div id="city-content">
                            <div class="des-city-area">
                                <h1 style={{ fontSize: "70px", textTransform: "uppercase", fontWeight: "bold", color: "#E6756B", margin: "35px 0 0px", textAlign: "center" }}>Description</h1>
                                <p id="city-description">
                                    Book professional Cooks and Chefs in {city} for House Parties, Birthday Parties, Special Breakfast, Lunch and Dinner at Home. Hire trained and verified personal Chefs and Cooks near you for a private dining experience at home with the best cooks and chef services at home.
                                </p>
                            </div>
                        </div>
                    </div>
                    <p id="city-seo-content" style={{ fontSize: "5px", margin: "20px 0 20px " }}>
                        Online chef for hire in {city}, Chef in {city}, Best caterers for small parties in  {city}, Best home-made cooking service in  {city}, Mini party caterers in  {city}, Book a chef in  {city}, Book a cook in  {city}, Book a private chef in  {city}, Book a private cook in  {city}, Book a trained verified cook near you in  {city}, Bookacook in  {city}, Caterers for small parties in  {city}, Top caterers in  {city}, Chef for a party in  {city}, Catering services in  {city}, Chef at home service in  {city}, Chef for a day in  {city}, Chef for a night in  {city}, Chef for hire in  {city}, Chef cooking at my home in  {city}, Chef near me in  {city}, Chef on demand in  {city}, Chef required at home in  {city}, Chefs for hire in  {city}, Chefs for home in  {city}, Hire a private chef in  {city}, Chefs on hire in  {city}, Cook chef near me in  {city}, Cook at home services in  {city}, Cook for a day in  {city}, Cook for a night in  {city}, Cook for one day in  {city}, Cook for a party in  {city}, Cook service near me in  {city}, Cook home services in  {city}, Cook near me in  {city}, Cook on demand in  {city}, Cook on hire near me in  {city}, Cook required at home in  {city}, Cooking as a service in {city}, Cooking maids near me in  {city}, Cooking services near me in  {city}, Cooks for hire in  {city}, Cooks for home in  {city}, Cooks near me in  {city}, Cooks on hire in  {city}, Domestic cook near me in  {city}, Find a chef in  {city}, Find a cook in  {city}, Hire a chef in  {city}, Hire a chef for a day in  {city}, Hire personal chef in  {city}, Hire a chef for home in  {city}, Hire a chef near me in  {city}, Take a Chef in  {city}, Hire a cook in  {city}, Hire a cook at home in  {city}, Hire a cook for home in  {city}, Hire a cook near me in  {city}, Hire a personal chef for a night in  {city}, Hire a personal cook in  {city}, Hire a professional chef in  {city}, Hire chef at home in  {city}, Hire cook near me in  {city}, Hire cook online in  {city}, Hire private chef in  {city}, Hire someone to cook for you in  {city}, Hiring a personal chef in  {city}, Home caterers in  {city}, Home chef near me in  {city}, Home cook near me in  {city}, Home cooking service in  {city}, Home cooking service near me in  {city}, Home party catering in  {city}, House chef near me in  {city}, House cook near me in  {city}, In-home cooking service in  {city}, In-house cooking service in  {city}, Local chefs for hire in  {city}, Looking for chef in  {city}, Looking for cook in  {city}, Mini caterers in  {city}, Need a chef in  {city}, Need a cook in  {city}, Online cook service in  {city}, Party caterers in  {city}, Personal chef in  {city}, Personal chefs for hire near me in  {city}, Personal Cook in  {city}, Personal cook near me in  {city}, Private chef in  {city}, Private chef hire in  {city}, Private chef near me in  {city}, Private chef services near me in  {city}, Private cook in  {city}, Private cook for hire in  {city}, Private personal chef in  {city}, Professional chef for hire in  {city}, Top rated chefs in  {city}, Top rated cooks in  {city}, Want to hire a cook in  {city}
                    </p>
                </div>
            </section>
        </div>
        </>
    );
}

const styles = {
    homebanner: {
        marginTop: "-76px",
    },
    pageWidth: {
        maxWidth: "100%",
        width: "1200px",
        margin: "0 auto",
    },
    bgImg: {
        backgroundSize: "cover",
        paddingTop: "110px",
        paddingBottom: "30px",
    },
    pageWidth: {
        maxWidth: "100%",
        width: "1200px",
        margin: "0 auto",
    },
    textContainer: {
        textAlign: "center",
        color: "white", // Adjust text color as needed
        margin: "0 0 70px 0",
    },
    bannerBottomSec: {
        display: "flex",
        justifyContent: "center",
        alignItems: "top",
        flexDirection: "row",
        padding: "0px 6%",
        margin: "0 auto",
        flexWrap: "wrap",
    },
    celebrateBottomSec: {
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "row",
        margin: "0 auto",
        flexWrap: "wrap",
    },
    celebrateBox: {
        margin: "0 1%",
        width: "20%",
    },
    bannerDecorationImage: {
        margin: "0 1%",
        width: "14%",
    },
    serviceSec: {
        backgroundColor: "rgba(230, 117, 107, 0.2)",
        borderRadius: "59px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "60px",
        marginBottom: "50px",
    },
    serviceSecRight: {
        width: "53%",
    },
    serviceSecLeft: {
        width: "40%",
    }

};

export default ChefCitypage;
