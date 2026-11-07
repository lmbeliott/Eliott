#include <iostream>
#include <string>
using namespace std;

int main() {
    string n;                    // le nombre reste une chaîne
    long long m;
    cin >> n >> m;
    long long r = 0;             // reste par m du nombre formé par les chiffres déjà lus
    for (char c : n) {
        int d = c - '0';
        r = (10 * r + d) % m;
    }
    cout << r << "\n";
    return 0;
}
