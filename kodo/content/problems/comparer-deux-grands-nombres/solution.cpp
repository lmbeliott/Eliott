#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    bool neg_a = a[0] == '-';
    bool neg_b = b[0] == '-';
    if (neg_a && !neg_b) {
        cout << "<\n";
    } else if (neg_b && !neg_a) {
        cout << ">\n";
    } else {
        // même signe : on compare les valeurs absolues (sans le "-")
        string va = a, vb = b;
        if (neg_a) {
            va = a.substr(1);
            vb = b.substr(1);
        }
        int compare;
        if (va.size() != vb.size()) {
            compare = va.size() < vb.size() ? -1 : 1;   // plus de chiffres : plus grand
        } else if (va == vb) {
            compare = 0;
        } else if (va < vb) {                           // même longueur : ordre des chaînes
            compare = -1;
        } else {
            compare = 1;
        }
        if (neg_a) {
            compare = -compare;                         // deux négatifs : l'ordre s'inverse
        }
        if (compare < 0) {
            cout << "<\n";
        } else if (compare > 0) {
            cout << ">\n";
        } else {
            cout << "=\n";
        }
    }
    return 0;
}
