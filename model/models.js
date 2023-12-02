    import mongoose from '../db/db-connection.js';

    // User Model
    const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        profile_picture: { type: String, default: "" },
        recovery_token: { type:String, default: "" },
    });

    const User = mongoose.model('User', userSchema);

    // Admin Model (Inherits from User)
    const adminSchema = new mongoose.Schema({
        entity_name: { type: String, required: true },
        deposit_address: { type: String, required: true },
        deposit_qr: { type: String, default: "" },
        available_days: { type: Number, required: true, default: 0 },
        account_state: { type: String, required: true, default: "activo", enum: ["activo", "suspendido"] },
    });

    const Admin = User.discriminator('Admin', adminSchema);

    // Client Model (Inherits from User)
    const clientSchema = new mongoose.Schema({
        fullname: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        account_state: { type: String, required: true, default: "en revision", enum: ["en revision", "activo", "suspendido"] },
        i_wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        usd_wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
    });

    const Client = User.discriminator('Client', clientSchema);

    // Package Model
    const packageSchema = new mongoose.Schema({
        name: { type: String, required: true },
        min_opening_amount: { type: Number, required: true },
        global_amount: { type: Number, required: true },
        revenue_freq: { type: Number, required: true },
        revenue_percentage: { type: Number, required: true },
        min_inv_days: { type: Number, required: true },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
    });

    const Package = mongoose.model('Package', packageSchema);

    // Wallet Model
    const walletSchema = new mongoose.Schema({
        type: { type: String, required: true, enum: ["USD", "Investment"] },
        name: { type: String, required: true },
        password: { type: String, required: true },
        available_amount: { type: Number, default: 0 },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
    });

    const Wallet = mongoose.model('Wallet', walletSchema);

    // Movement Model
    const movementSchema = new mongoose.Schema({
        date: { type: Date, default: Date.now, required:true },
        movement_state: { type: String, required:true, default: "pendiente", enum: ["pendiente", "aprobado", "rechazado", "remitido", "cancelado", "resuelto"] },
        description: { type: String },  
        admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    });

    const Movement = mongoose.model('Movement', movementSchema);

    // Wallet Transaction Model (Inherits from Movement)
    const walletTransactionSchema = new mongoose.Schema({
        transaction_amount: { type: Number, required: true },
        origin_wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        dest_wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
        received_amount: { type: Number, default: 0 },
    });

    const WalletTransaction = Movement.discriminator('WalletTransaction', walletTransactionSchema);

    // Support Ticket Model (Inherits from Movement)
    const supportTicketSchema = new mongoose.Schema({
        category: { type: String, required: true }
    });

    const SupportTicket = Movement.discriminator('SupportTicket', supportTicketSchema);

    // Investment Model
    const investmentSchema = new mongoose.Schema({
        start_date: { type: Date, default: Date.now },
        actual_start_date: { type: Date },
        end_date: { type: Date, required: true },
        package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
        state: { type: String, required: true, default:"pendiente", enum: ["pendiente", "en curso", "rechazado", "finalizado"] },
        wallet: { type: mongoose.Schema.Types.ObjectId, ref:"Wallet" },
        inv_amount: { type: Number, default: 0 },
        revenue: { type: Number, default: 0 }
    });

    const Investment = mongoose.model('Investment', investmentSchema);

    export {
        User,
        Admin,
        Client,
        Package,
        Wallet,
        Movement,
        WalletTransaction,
        SupportTicket,
        Investment,
    };
