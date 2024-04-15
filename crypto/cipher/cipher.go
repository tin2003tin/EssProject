package tin_cipher

type Block interface {
	BlockSize() int
	Encrypt(dst, src []byte)
	Decrypt(dst, src []byte)
}

type Stream interface {
}

type BlockMode interface {
	BlockSize()

	CryptBlocks(dst, src []byte)
}
