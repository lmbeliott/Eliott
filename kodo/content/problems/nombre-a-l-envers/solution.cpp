#include <iostream>
using namespace std;

int main() {
    long long n;
    cin >> n;
    long long depart = n;     // copie : la boucle va détruire n
    long long r = 0;
    while (n > 0) {
        long long chiffre = n % 10;
        r = r * 10 + chiffre;  // on ajoute le chiffre à droite de r
        n = n / 10;
    }
    cout << r << "\n";
    if (r == depart) {
        cout << "OUI" << "\n";
    } else {
        cout << "NON" << "\n";
    }
    return 0;
}
