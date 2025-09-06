class BookingService {
    constructor(BookingModel) {
        this.BookingModel = BookingModel;
    }

    async saveBooking(bookingData) {
        const booking = new this.BookingModel(bookingData);
        return await booking.save();
    }

    async findBooking(bookingId) {
        return await this.BookingModel.findById(bookingId);
    }

    async cancelBooking(bookingId) {
        return await this.BookingModel.findByIdAndDelete(bookingId);
    }
}

export default BookingService;