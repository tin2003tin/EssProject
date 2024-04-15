package tin_unsafe

type ArbitraryType int

type IntergerType int

type Pointer *ArbitraryType

func Sizeof(x ArbitraryType) uintptr

func Offsetof(x ArbitraryType) uintptr

func Alignof(x ArbitraryType) uintptr

func Add(ptr Pointer, len IntergerType) Pointer

func Slice(ptr *ArbitraryType, len IntergerType) []ArbitraryType

func SliceData(slice []ArbitraryType) *ArbitraryType

func String(ptr *byte, len IntergerType) string

func StringData(str string) *byte
