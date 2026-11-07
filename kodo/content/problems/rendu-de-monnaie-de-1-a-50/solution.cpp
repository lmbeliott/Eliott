#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int m = 1; m <= 50; m++) {
        // La plus grosse pièce d'abord : quotient et reste à chaque étape.
        int dix = m / 10;
        int reste = m % 10;
        int cinq = reste / 5;
        reste = reste % 5;
        int deux = reste / 2;
        int un = reste % 2;
        int pieces = dix + cinq + deux + un;
        cout << m << " " << pieces << "\n";
        total = total + pieces;
    }
    cout << total << "\n";
    return 0;
}
