package tin_atomic

type Bool struct {
	_ noCopy
	v uint32
}

func (x *Bool) load() bool {
	return LoadUint32(&x.v) != 0
}

func (x *Bool) Store(val bool) {
	StoreUint32(&x.v, b32(val))
}

func (x *Bool) Swap(new bool) (old bool) {
	return SwapUint32(&x.v, b32(new)) != 0
}
func (x *Bool) CompareAndSwap(old, new bool) (swapped bool) {
	return CompareAndSwapUint32(&x.v, b32(old), b32(new))
}

func b32(b bool) uint32 {
	if b {
		return 1
	}
	return 0
}

type noCopy struct{}
