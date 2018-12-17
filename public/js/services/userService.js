require('angular');

angular.module('DDKApp').service('userService', function () {

    this.rememberPassphrase = false;
    this.rememberedPassphrase = '';
 
    this.setData = function (address, publicKey, balance, unconfirmedBalance, effectiveBalance, token, totalFrozeAmount, username, groupBonus, user_status) {
        this.address = address;
        this.publicKey = publicKey;
        this.balance = balance / 100000000;
        this.unconfirmedBalance = unconfirmedBalance / 100000000;
        this.effectiveBalance = effectiveBalance / 100000000;
        this._balance = balance;
        this._unconfirmedBalance = unconfirmedBalance;
        this.token = token;
        this.totalFrozeAmount= totalFrozeAmount;
        this.username = username;
        this.groupBonus = groupBonus;
        this.userStatus = user_status;
    }

    this.getPublicKey = function() {
        return this.publicKey;
    }

    this.getBalance = function() {
        return this.balance
    }

    this.getAddress = function () {
       return this.address;
    }

    this.setSessionPassphrase = function (pass) {
        this.rememberPassphrase = true;
        this.rememberedPassphrase = pass;
    }

    this.setForging = function (forging) {
        this.forging = forging;
    }

    this.setMultisignature = function (multisignature,cb) {
        this.multisignature = multisignature;
        cb(multisignature);
    }

    this.setDelegate = function (delegate) {
        this.delegate = delegate;
    }

    this.setDelegateTime = function (transactions) {
        this.delegate.time = transactions[0].timestamp;
    }

    this.setDelegateProcess = function (delegate) {
        this.delegateInRegistration = delegate;
    }

    this.setSecondPassphrase = function (secondPassPhrase) {
        this.secondPassphrase = secondPassPhrase;
    }

});
