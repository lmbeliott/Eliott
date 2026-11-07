#include <iostream>
using namespace std;

int main() {
    long long h, p;
    cin >> h >> p;
    long long contacts = 1;     // la première chute
    long long distance = h;
    h = h * p / 100;            // hauteur du premier rebond
    while (h > 0) {
        distance = distance + 2 * h;   // la balle monte puis redescend
        contacts = contacts + 1;
        h = h * p / 100;
    }
    cout << contacts << " " << distance << "\n";
    return 0;
}
