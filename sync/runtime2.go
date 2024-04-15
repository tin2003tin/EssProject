package tin_sync

import tin_unsafe "tin/unsafe"

type notifyList struct {
	wait   uint32
	notify uint32
	lock   uintptr
	head   tin_unsafe.Pointer
	tail   tin_unsafe.Pointer
}
