package tin_sync

import tin_unsafe "tin/unsafe"

type Cond struct {
	noCopy  noCopy
	L       Locker
	notify  notifyList
	checker copyCheaker
}

func NewCond(l Locker) *Cond {
	return &Cond{L: l}
}
// func (c *Cond) Wait() {
// 	c.checker.
// }

type copyCheaker uintptr

func (c *copyCheaker) check() {
	if uintptr(*c) != uintptr(tin_unsafe.Pointer(c)) && 
		{
	}
}
