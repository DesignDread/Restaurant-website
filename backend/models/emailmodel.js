const UserSchema = new Schema({

    favourites: [{ type: Schema.Types.ObjectId, ref: "Food" }],
  
    // <-- add this block
    emailPreferences: {
      orderConfirmations: { type: Boolean, default: true },
      orderStatusUpdates: { type: Boolean, default: true },
      promotions:         { type: Boolean, default: true }
    }
  }, { timestamps: true });
  