import { Module } from '@nestjs/common';
import { COURIER_ADAPTER } from './courier.interface.js';
import { SteadfastAdapter } from './steadfast.adapter.js';

/**
 * One provider to start (COURIER_PROVIDER). Add adapters here and switch on the
 * env var — the rest of the app depends only on the CourierAdapter interface,
 * never on a concrete courier.
 */
@Module({
  providers: [
    SteadfastAdapter,
    {
      provide: COURIER_ADAPTER,
      useFactory: (steadfast: SteadfastAdapter) => {
        const provider = process.env.COURIER_PROVIDER ?? 'steadfast';
        switch (provider) {
          case 'steadfast':
            return steadfast;
          default:
            throw new Error(`Unknown COURIER_PROVIDER: ${provider}`);
        }
      },
      inject: [SteadfastAdapter],
    },
  ],
  exports: [COURIER_ADAPTER],
})
export class CourierModule {}
