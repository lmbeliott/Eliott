#include <iostream>
#include <string>
using namespace std;

int main() {
    string a, b;
    cin >> a >> b;
    int reponse = -1;
    for (int k = 0; k < (int) a.size(); k++) {
        if (a.substr(k) + a.substr(0, k) == b) {   // le mot tourné de k crans
            reponse = k;
            break;                                 // on garde le plus petit k
        }
    }
    cout << reponse << "\n";
    return 0;
}
