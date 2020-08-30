import { Model, mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';
import moment from 'moment';
import SubscriptionPeriod from '@/services/Subscription/SubscriptionPeriod';

export default class PlanSubscription extends mixin(SystemModel) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_plan_subscriptions';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Defined virtual attributes.
   */
  static get virtualAttributes() {
    return ['active', 'inactive', 'ended', 'onTrial'];
  }

  /**
   * Modifiers queries.
   */
  static get modifiers() {
    return {
      activeSubscriptions(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const now = moment().format(dateFormat);

        builder.where('ends_at', '>', now);
        builder.where('trial_ends_at', '>', now);
      },

      inactiveSubscriptions() {
        builder.modify('endedTrial');
        builder.modify('endedPeriod');
      },

      subscriptionBySlug(builder, subscriptionSlug) {
        builder.where('slug', subscriptionSlug);
      },

      endedTrial(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('ends_at', '<=', endDate);
      },

      endedPeriod(builder) {
        const dateFormat = 'YYYY-MM-DD HH:mm:ss';
        const endDate = moment().format(dateFormat);

        builder.where('trial_ends_at', '<=', endDate);
      }
    };
  }

  /**
   * Relations mappings.
   */
  static get relationMappings() {
    const Tenant = require('@/system/Models/Tenant');
    const Plan = require('@/system/Models/Subscriptions/Plan');

    return {
      /**
       * Plan subscription belongs to tenant.
       */
      tenant: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Tenant.default),
        join: {
          from: 'subscription_plan_subscriptions.tenantId',
          to: 'tenants.id'
        },
      },

      /**
       * Plan description belongs to plan.
       */
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Plan.default),
        join: {
          from: 'subscription_plan_subscriptions.planId',
          to: 'subscription_plans.id',
        },
      },
    };
  }

  /**
   * Check if subscription is active.
   * @return {Boolean}
   */
  active() {
    return !this.ended() || this.onTrial();
  }

  /**
   * Check if subscription is inactive.
   * @return {Boolean}
   */
  inactive() {
    return !this.active();
  }

  /**
   * Check if subscription period has ended.
   * @return {Boolean}
   */
  ended() {
    return this.endsAt ? moment().isAfter(this.endsAt) : false;
  }

  /**
   * Check if subscription is currently on trial.
   * @return {Boolean}
   */
  onTrial() {
    return this.trailEndsAt ? moment().isAfter(this.trailEndsAt) : false;
  }

  /**
   * Set new period from the given details.
   * @param {string} invoiceInterval 
   * @param {number} invoicePeriod 
   * @param {string} start 
   * 
   * @return {Object}
   */
  setNewPeriod(invoiceInterval, invoicePeriod, start) {
    let _invoiceInterval = invoiceInterval;
    let _invoicePeriod = invoicePeriod;
    
    if (!invoiceInterval) {
      _invoiceInterval = this.plan.invoiceInterval;
    }
    if (!invoicePeriod) {
      _invoicePeriod = this.plan.invoicePeriod;
    }
    const period = new SubscriptionPeriod(_invoiceInterval, _invoicePeriod, start);

    const startsAt = period.getStartDate();
    const endsAt = period.getEndDate();

    return { startsAt, endsAt };
  }

  /**
   * Renews subscription period.
   * @Promise
   */
  renew(plan) {
    const { invoicePeriod, invoiceInterval } = plan;
    const patch = { ...this.setNewPeriod(invoiceInterval, invoicePeriod) };
    patch.cancelsAt = null;
    patch.planId = plan.id;

    return this.$query().patch(patch);
  }
}