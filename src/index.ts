import errCode from 'err-code'
import type { ConnectionGater, ConnectionProtector } from '@libp2p/interface-connection'
import type { ContentRouting } from '@libp2p/interface-content-routing'
import type { AddressManager } from '@libp2p/interface-address-manager'
import { isStartable, Startable } from '@libp2p/interfaces/startable'
import type { Metrics } from '@libp2p/interface-metrics'
import type { PeerId } from '@libp2p/interface-peer-id'
import type { PeerRouting } from '@libp2p/interface-peer-routing'
import type { PeerStore } from '@libp2p/interface-peer-store'
import type { Registrar } from '@libp2p/interface-registrar'
import type { TransportManager, Upgrader } from '@libp2p/interface-transport'
import type { Datastore } from 'interface-datastore'
import type { PubSub } from '@libp2p/interface-pubsub'
import type { DualDHT } from '@libp2p/interface-dht'
import type { ConnectionManager, Dialer } from '@libp2p/interface-connection-manager'

export interface Initializable {
  init: (components: Components) => void
}

export function isInitializable (obj: any): obj is Initializable {
  return obj != null && typeof obj.init === 'function'
}

export interface ComponentsInit {
  peerId?: PeerId
  addressManager?: AddressManager
  peerStore?: PeerStore
  upgrader?: Upgrader
  metrics?: Metrics
  registrar?: Registrar
  connectionManager?: ConnectionManager
  transportManager?: TransportManager
  connectionGater?: ConnectionGater
  contentRouting?: ContentRouting
  peerRouting?: PeerRouting
  datastore?: Datastore
  connectionProtector?: ConnectionProtector
  dht?: DualDHT
  pubsub?: PubSub
  dialer?: Dialer
}

export class Components implements Startable {
  private _peerId?: PeerId
  private _addressManager?: AddressManager
  private _peerStore?: PeerStore
  private _upgrader?: Upgrader
  private _metrics?: Metrics
  private _registrar?: Registrar
  private _connectionManager?: ConnectionManager
  private _transportManager?: TransportManager
  private _connectionGater?: ConnectionGater
  private _contentRouting?: ContentRouting
  private _peerRouting?: PeerRouting
  private _datastore?: Datastore
  private _connectionProtector?: ConnectionProtector
  private _dht?: DualDHT
  private _pubSub?: PubSub
  private _dialer?: Dialer
  private _started = false

  constructor (init: ComponentsInit = {}) {
    if (init.peerId != null) {
      this.setPeerId(init.peerId)
    }

    if (init.addressManager != null) {
      this.setAddressManager(init.addressManager)
    }

    if (init.peerStore != null) {
      this.setPeerStore(init.peerStore)
    }

    if (init.upgrader != null) {
      this.setUpgrader(init.upgrader)
    }

    if (init.metrics != null) {
      this.setMetrics(init.metrics)
    }

    if (init.registrar != null) {
      this.setRegistrar(init.registrar)
    }

    if (init.connectionManager != null) {
      this.setConnectionManager(init.connectionManager)
    }

    if (init.transportManager != null) {
      this.setTransportManager(init.transportManager)
    }

    if (init.connectionGater != null) {
      this.setConnectionGater(init.connectionGater)
    }

    if (init.contentRouting != null) {
      this.setContentRouting(init.contentRouting)
    }

    if (init.peerRouting != null) {
      this.setPeerRouting(init.peerRouting)
    }

    if (init.datastore != null) {
      this.setDatastore(init.datastore)
    }

    if (init.connectionProtector != null) {
      this.setConnectionProtector(init.connectionProtector)
    }

    if (init.dht != null) {
      this.setDHT(init.dht)
    }

    if (init.pubsub != null) {
      this.setPubSub(init.pubsub)
    }

    if (init.dialer != null) {
      this.setDialer(init.dialer)
    }
  }

  isStarted () {
    return this._started
  }

  async beforeStart () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        if (startable.beforeStart != null) {
          await startable.beforeStart()
        }
      })
    )
  }

  async start () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        await startable.start()
      })
    )

    this._started = true
  }

  async afterStart () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        if (startable.afterStart != null) {
          await startable.afterStart()
        }
      })
    )
  }

  async beforeStop () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        if (startable.beforeStop != null) {
          await startable.beforeStop()
        }
      })
    )
  }

  async stop () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        await startable.stop()
      })
    )

    this._started = false
  }

  async afterStop () {
    await Promise.all(
      Object.values(this).filter(obj => isStartable(obj)).map(async (startable: Startable) => {
        if (startable.afterStop != null) {
          await startable.afterStop()
        }
      })
    )
  }

  get peerId (): PeerId {
    if (this._peerId == null) {
      throw errCode(new Error('peerId not set'), 'ERR_SERVICE_MISSING')
    }

    return this._peerId
  }

  get metrics (): Metrics | undefined {
    return this._metrics
  }

  get addressManager (): AddressManager {
    if (this._addressManager == null) {
      throw errCode(new Error('addressManager not set'), 'ERR_SERVICE_MISSING')
    }

    return this._addressManager
  }

  get peerStore (): PeerStore {
    if (this._peerStore == null) {
      throw errCode(new Error('peerStore not set'), 'ERR_SERVICE_MISSING')
    }

    return this._peerStore
  }

  get upgrader (): Upgrader {
    if (this._upgrader == null) {
      throw errCode(new Error('upgrader not set'), 'ERR_SERVICE_MISSING')
    }

    return this._upgrader
  }

  get registrar (): Registrar {
    if (this._registrar == null) {
      throw errCode(new Error('registrar not set'), 'ERR_SERVICE_MISSING')
    }

    return this._registrar
  }

  get connectionManager (): ConnectionManager {
    if (this._connectionManager == null) {
      throw errCode(new Error('connectionManager not set'), 'ERR_SERVICE_MISSING')
    }

    return this._connectionManager
  }

  get transportManager (): TransportManager {
    if (this._transportManager == null) {
      throw errCode(new Error('transportManager not set'), 'ERR_SERVICE_MISSING')
    }

    return this._transportManager
  }

  get connectionGater (): ConnectionGater {
    if (this._connectionGater == null) {
      throw errCode(new Error('connectionGater not set'), 'ERR_SERVICE_MISSING')
    }

    return this._connectionGater
  }

  get contentRouting (): ContentRouting {
    if (this._contentRouting == null) {
      throw errCode(new Error('contentRouting not set'), 'ERR_SERVICE_MISSING')
    }

    return this._contentRouting
  }

  get peerRouting (): PeerRouting {
    if (this._peerRouting == null) {
      throw errCode(new Error('peerRouting not set'), 'ERR_SERVICE_MISSING')
    }

    return this._peerRouting
  }

  get datastore (): Datastore {
    if (this._datastore == null) {
      throw errCode(new Error('datastore not set'), 'ERR_SERVICE_MISSING')
    }

    return this._datastore
  }

  get connectionProtector (): ConnectionProtector | undefined {
    return this._connectionProtector
  }

  get dht (): DualDHT {
    if (this._dht == null) {
      throw errCode(new Error('dht not set'), 'ERR_SERVICE_MISSING')
    }

    return this._dht
  }

  get pubSub (): PubSub {
    if (this._pubSub == null) {
      throw errCode(new Error('pubsub not set'), 'ERR_SERVICE_MISSING')
    }

    return this._pubSub
  }

  get dialer (): Dialer {
    if (this._dialer == null) {
      throw errCode(new Error('dialer not set'), 'ERR_SERVICE_MISSING')
    }

    return this._dialer
  }

  setPeerId (peerId: PeerId) {
    this._peerId = peerId

    return peerId
  }

  getPeerId (): PeerId {
    return this.peerId
  }

  setMetrics (metrics: Metrics) {
    this._metrics = metrics

    if (isInitializable(metrics)) {
      metrics.init(this)
    }

    return metrics
  }

  getMetrics (): Metrics | undefined {
    return this.metrics
  }

  setAddressManager (addressManager: AddressManager) {
    this._addressManager = addressManager

    if (isInitializable(addressManager)) {
      addressManager.init(this)
    }

    return addressManager
  }

  getAddressManager (): AddressManager {
    return this.addressManager
  }

  setPeerStore (peerStore: PeerStore) {
    this._peerStore = peerStore

    if (isInitializable(peerStore)) {
      peerStore.init(this)
    }

    return peerStore
  }

  getPeerStore (): PeerStore {
    return this.peerStore
  }

  setUpgrader (upgrader: Upgrader) {
    this._upgrader = upgrader

    if (isInitializable(upgrader)) {
      upgrader.init(this)
    }

    return upgrader
  }

  getUpgrader (): Upgrader {
    return this.upgrader
  }

  setRegistrar (registrar: Registrar) {
    this._registrar = registrar

    if (isInitializable(registrar)) {
      registrar.init(this)
    }

    return registrar
  }

  getRegistrar (): Registrar {
    return this.registrar
  }

  setConnectionManager (connectionManager: ConnectionManager) {
    this._connectionManager = connectionManager

    if (isInitializable(connectionManager)) {
      connectionManager.init(this)
    }

    return connectionManager
  }

  getConnectionManager (): ConnectionManager {
    return this.connectionManager
  }

  setTransportManager (transportManager: TransportManager) {
    this._transportManager = transportManager

    if (isInitializable(transportManager)) {
      transportManager.init(this)
    }

    return transportManager
  }

  getTransportManager (): TransportManager {
    return this.transportManager
  }

  setConnectionGater (connectionGater: ConnectionGater) {
    this._connectionGater = connectionGater

    if (isInitializable(connectionGater)) {
      connectionGater.init(this)
    }

    return connectionGater
  }

  getConnectionGater (): ConnectionGater {
    return this.connectionGater
  }

  setContentRouting (contentRouting: ContentRouting) {
    this._contentRouting = contentRouting

    if (isInitializable(contentRouting)) {
      contentRouting.init(this)
    }

    return contentRouting
  }

  getContentRouting (): ContentRouting {
    return this.contentRouting
  }

  setPeerRouting (peerRouting: PeerRouting) {
    this._peerRouting = peerRouting

    if (isInitializable(peerRouting)) {
      peerRouting.init(this)
    }

    return peerRouting
  }

  getPeerRouting (): PeerRouting {
    return this.peerRouting
  }

  setDatastore (datastore: Datastore) {
    this._datastore = datastore

    if (isInitializable(datastore)) {
      datastore.init(this)
    }

    return datastore
  }

  getDatastore (): Datastore {
    return this.datastore
  }

  setConnectionProtector (connectionProtector: ConnectionProtector) {
    this._connectionProtector = connectionProtector

    if (isInitializable(connectionProtector)) {
      connectionProtector.init(this)
    }

    return connectionProtector
  }

  getConnectionProtector (): ConnectionProtector | undefined {
    return this.connectionProtector
  }

  setDHT (dht: DualDHT) {
    this._dht = dht

    if (isInitializable(dht)) {
      dht.init(this)
    }

    return dht
  }

  getDHT (): DualDHT {
    return this.dht
  }

  setPubSub (pubsub: PubSub) {
    this._pubSub = pubsub

    if (isInitializable(pubsub)) {
      pubsub.init(this)
    }

    return pubsub
  }

  getPubSub (): PubSub {
    return this.pubSub
  }

  setDialer (dialer: Dialer) {
    this._dialer = dialer

    if (isInitializable(dialer)) {
      dialer.init(this)
    }

    return dialer
  }

  getDialer (): Dialer {
    return this.dialer
  }
}
