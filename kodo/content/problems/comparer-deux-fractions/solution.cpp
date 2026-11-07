#include <iostream>
using namespace std;

int main() {
    long long a, b, c, d;
    cin >> a >> b >> c >> d;
    // b et d sont positifs : a/b < c/d équivaut à a*d < c*b (produit en croix)
    long long gauche = a * d;
    long long droite = c * b;
    if (gauche < droite) {
        cout << "<\n";
    } else if (gauche > droite) {
        cout << ">\n";
    } else {
        cout << "=\n";
    }
    return 0;
}
