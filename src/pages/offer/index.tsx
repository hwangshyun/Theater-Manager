// import AddOffer from "./components/add-offer";

import AddOfferModal from "./components/add-offer-modal";
import OfferList from "./components/offer-list";

function Offer() {



  return (
    <div className="flex items-center justify-center h-screen w-full">
      <AddOfferModal />
      <OfferList />

    </div>
  );
}

export default Offer;
