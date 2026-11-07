#include <iostream>
using namespace std;

int arrondi_au_dixieme(int total, int coefs) {
    // plus proche entier de 10 × total / coefs, les demis vers le haut,
    // calculé uniquement avec des entiers
    return (20 * total + coefs) / (2 * coefs);
}

int main() {
    int n;
    cin >> n;
    int total = 0;
    int coefs = 0;
    for (int i = 0; i < n; i++) {
        int note, coef;
        cin >> note >> coef;
        total = total + note * coef;
        coefs = coefs + coef;
    }
    int dixiemes = arrondi_au_dixieme(total, coefs);
    cout << dixiemes / 10 << "." << dixiemes % 10 << "\n";
    return 0;
}
