package tin_sync

type Locker interface {
	Lock()
	Unlock()
}
