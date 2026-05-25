import * as db from '../db.js';

export const createDelivery = async (req, res) => {
  try {
    const { donationId, dropLocation } = req.body;
    const donation = await db.findDonationById(donationId);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const delivery = await db.createDelivery({
      donation: donationId,
      donor: donation.donor?._id || donation.donor,
      ngo: req.userId,
      pickupLocation: donation.pickupLocation,
      dropLocation,
    });
    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const filter = {};
    if (req.userRole === 'delivery_partner') filter.deliveryPartner = req.userId;
    else if (req.userRole === 'ngo') filter.ngo = req.userId;
    else if (req.userRole !== 'admin') filter.donor = req.userId;

    const deliveries = await db.findDeliveries(filter);
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignDelivery = async (req, res) => {
  try {
    const delivery = await db.updateDelivery({ _id: req.params.id }, { deliveryPartner: req.userId, status: 'assigned' });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { status, pickupTime, dropTime } = req.body;
    const delivery = await db.updateDelivery({ _id: req.params.id }, { status, pickupTime, dropTime });
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });

    if (status === 'delivered' && delivery.donation) {
      const donId = typeof delivery.donation === 'object' ? delivery.donation._id : delivery.donation;
      await db.updateDonation({ _id: donId }, { $set: { status: 'delivered' } });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
