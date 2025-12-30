const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: true,
    validate: {
      is: /^[0-9]{10}$/
    }
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  pan_number: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: true,
    validate: {
      is: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    }
  },
  aadhaar_number: {
    type: DataTypes.STRING(12),
    unique: true,
    allowNull: true,
    validate: {
      is: /^[0-9]{12}$/
    }
  },
  kyc_status: {
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'VERIFIED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  risk_profile: {
    type: DataTypes.ENUM('LOW', 'MODERATE', 'HIGH', 'VERY_HIGH'),
    defaultValue: 'MODERATE'
  },
  investment_experience: {
    type: DataTypes.ENUM('NONE', 'BEGINNER', 'INTERMEDIATE', 'EXPERT')
  },
  annual_income: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(50),
    defaultValue: 'India'
  },
  profile_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  phone_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  two_factor_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {
      notifications: true,
      email_alerts: true,
      sms_alerts: false,
      risk_updates: true
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  delete values.two_factor_secret;
  return values;
};

module.exports = User;